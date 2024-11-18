# # chatbot/ai/entity_recognizer.py

# from transformers import pipeline

# class EntityRecognizer:
#     def __init__(self):
#         # Load a pretrained named entity recognition model
#         self.model = pipeline("ner", model="dslim/bert-base-NER")

#     def predict(self, message):
#         # Run NER on the input message
#         entities = self.model(message)
#         # Process entities to a simpler format
#         simplified_entities = [{"entity": entity['entity'], "word": entity['word']} for entity in entities]
#         return simplified_entities
