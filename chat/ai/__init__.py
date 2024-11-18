# chatbot/ai/__init__.py

from .intent_classifier import IntentClassifier
from .sentiment_analyzer import SentimentAnalyzer
from .entity_recognizer import EntityRecognizer
from .response_generator import ResponseGenerator

# Instantiate models
intent_classifier = IntentClassifier()
sentiment_analyzer = SentimentAnalyzer()
entity_recognizer = EntityRecognizer()
response_generator = ResponseGenerator()

# Define utility functions to be used in views
def get_intent(message):
    return intent_classifier.predict(message)

def get_sentiment(message):
    return sentiment_analyzer.predict(message)

def get_entities(message):
    return entity_recognizer.predict(message)

def generate_response(message):
    return response_generator.generate(message)
