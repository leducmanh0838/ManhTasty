from project.settings import COHERE_API_KEY
import cohere

cohere_client = cohere.Client(COHERE_API_KEY)