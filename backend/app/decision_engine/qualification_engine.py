from typing import List, Dict
import uuid
from app.decision_engine.models import ValidationResult, QualificationResult, QualificationStatus, ConstraintStatus

class QualificationEngine:
    """
    Determines supplier qualification based on constraint validations.
    Mandatory failure -> REJECTED
    """
    @staticmethod
    def evaluate(validations: List[ValidationResult], mandatory_requirement_ids: set[uuid.UUID], supplier_ids: List[uuid.UUID] = None) -> Dict[uuid.UUID, QualificationResult]:
        supplier_status: Dict[uuid.UUID, QualificationResult] = {}
        supplier_ids = supplier_ids or []
        
        # Initialize all suppliers as QUALIFIED initially
        for sid in supplier_ids:
            supplier_status[sid] = QualificationResult(
                supplier_id=sid,
                status=QualificationStatus.QUALIFIED,
                reason="No mandatory requirements failed."
            )
        
        # Group by supplier
        by_supplier = {}
        for v in validations:
            by_supplier.setdefault(v.supplier_id, []).append(v)
            
        for supplier_id, supp_vals in by_supplier.items():
            status = QualificationStatus.QUALIFIED
            reason = "Met all mandatory requirements."
            
            for v in supp_vals:
                if v.requirement_id in mandatory_requirement_ids:
                    if v.status == ConstraintStatus.FAIL:
                        status = QualificationStatus.REJECTED
                        reason = f"Failed mandatory requirement: {v.reason}"
                        break
                    elif v.status == ConstraintStatus.UNKNOWN:
                        if status == QualificationStatus.QUALIFIED:
                            status = QualificationStatus.CONDITIONALLY_QUALIFIED
                            reason = "Missing data for a mandatory requirement, conditionally qualified pending review."
            
            # Only update reason if it actually changed or wasn't previously QUALIFIED
            if status != QualificationStatus.QUALIFIED or supplier_id not in supplier_status:
                supplier_status[supplier_id] = QualificationResult(
                    supplier_id=supplier_id,
                    status=status,
                    reason=reason
                )
            
        return supplier_status
