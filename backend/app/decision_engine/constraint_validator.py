from app.knowledge.models import ProcurementProject, Supplier, Requirement
from app.decision_engine.models import ValidationResult, ConstraintStatus

class ConstraintValidator:
    """
    Validates suppliers against all requirements.
    No LLM used. Pure deterministic logic.
    """
    @staticmethod
    def validate(project: ProcurementProject) -> list[ValidationResult]:
        results = []
        for supplier in project.suppliers:
            for req in project.requirements:
                results.append(ConstraintValidator._evaluate(supplier, req))
        return results

    @staticmethod
    def _evaluate(supplier: Supplier, req: Requirement) -> ValidationResult:
        # Simplistic deterministic logic for the sake of the engine structure
        # A real system would use a rules engine to parse `operator` and evaluate
        
        status = ConstraintStatus.UNKNOWN
        actual = None
        reason = "Requirement could not be automatically evaluated against supplier data."
        
        req_name = req.name.lower()
        
        # MOQ evaluation
        if "moq" in req_name:
            # check supplier quotes for moq
            actual_moq = None
            if supplier.quotes and supplier.quotes[0].moq is not None:
                actual_moq = supplier.quotes[0].moq
                actual = str(actual_moq)
            
            if actual_moq is not None and req.expected_value:
                try:
                    exp_moq = int(req.expected_value)
                    if actual_moq <= exp_moq:
                        status = ConstraintStatus.PASS
                        reason = f"Supplier MOQ ({actual_moq}) satisfies requirement (<= {exp_moq})."
                    else:
                        status = ConstraintStatus.FAIL
                        reason = f"Supplier MOQ ({actual_moq}) exceeds requirement ({exp_moq})."
                except ValueError:
                    status = ConstraintStatus.UNKNOWN
                    reason = "Failed to parse expected MOQ value as integer."
            elif req.expected_value:
                if req.mandatory:
                    status = ConstraintStatus.FAIL
                    reason = "Supplier missing MOQ data for a mandatory requirement."
        
        # Certification evaluation
        elif "cert" in req_name or "iso" in req_name:
            if not req.expected_value:
                req.expected_value = req.name
                
            has_cert = any(c.name.lower() == req.expected_value.lower() for c in supplier.certifications)
            actual = "Present" if has_cert else "Missing"
            if has_cert:
                status = ConstraintStatus.PASS
                reason = f"Supplier has certification: {req.expected_value}."
            else:
                status = ConstraintStatus.FAIL if req.mandatory else ConstraintStatus.WARNING
                reason = f"Supplier is missing certification: {req.expected_value}."
                
        # Lead Time evaluation
        elif "lead" in req_name:
            actual_lt = None
            if supplier.quotes and supplier.quotes[0].lead_time is not None:
                actual_lt = supplier.quotes[0].lead_time
                actual = str(actual_lt)
                
            if actual_lt is not None and req.expected_value:
                try:
                    exp_lt = int(req.expected_value)
                    if actual_lt <= exp_lt:
                        status = ConstraintStatus.PASS
                        reason = f"Supplier lead time ({actual_lt}) satisfies requirement (<= {exp_lt})."
                    else:
                        status = ConstraintStatus.FAIL
                        reason = f"Supplier lead time ({actual_lt}) exceeds requirement ({exp_lt})."
                except ValueError:
                    status = ConstraintStatus.UNKNOWN
                    reason = "Failed to parse expected lead time."
            elif req.expected_value and req.mandatory:
                status = ConstraintStatus.FAIL
                reason = "Supplier missing lead time data for a mandatory requirement."

        # Material or generic capability
        else:
            has_cap = any(req.expected_value and req.expected_value.lower() in c.value.lower() for c in supplier.capabilities)
            if has_cap:
                status = ConstraintStatus.PASS
                actual = req.expected_value
                reason = f"Supplier has required capability: {req.expected_value}."
            else:
                actual = "Missing"
                status = ConstraintStatus.FAIL if req.mandatory else ConstraintStatus.WARNING
                reason = f"Supplier is missing required capability: {req.expected_value}."

        return ValidationResult(
            supplier_id=supplier.id,
            requirement_id=req.id,
            status=status,
            expected=req.expected_value,
            actual=actual,
            reason=reason,
            evidence_ids=req.evidence_ids # Passing down requirement evidence, should ideally mix with supplier evidence
        )
