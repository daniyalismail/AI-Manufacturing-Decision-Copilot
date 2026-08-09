from app.api.exceptions import APIException

class KnowledgeError(APIException):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(code="KNOWLEDGE_ERROR", message=message, status_code=status_code)
