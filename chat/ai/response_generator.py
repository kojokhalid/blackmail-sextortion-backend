# import torch
# from transformers import AutoModelForCausalLM, AutoTokenizer

# class ResponseGenerator:
#     def __init__(self):
#         # Load the DialoGPT model and tokenizer
#         self.model_name = "microsoft/DialoGPT-small"
#         self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
#         self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
#         self.chat_history_ids = None  # To store the conversation history

#     def generate(self, message):
#         # Encode the user input and add the EOS token
#         new_user_input_ids = self.tokenizer.encode(message + self.tokenizer.eos_token, return_tensors="pt")

#         # If it's not the first message, append the new input to the chat history
#         if self.chat_history_ids is not None:
#             bot_input_ids = torch.cat([self.chat_history_ids, new_user_input_ids], dim=-1)
#         else:
#             bot_input_ids = new_user_input_ids

#         # Generate a response with the current chat history
#         chat_history_ids = self.model.generate(
#             bot_input_ids,
#             max_length=1000,
#             pad_token_id=self.tokenizer.eos_token_id,
#             temperature=0.7,
#             top_p=0.9,
#             do_sample=True  # Enable sampling
#         )

#         # Save the chat history for future inputs
#         self.chat_history_ids = chat_history_ids

#         # Decode the generated response and return it
#         generated_response = self.tokenizer.decode(
#             chat_history_ids[:, bot_input_ids.shape[-1]:][0], 
#             skip_special_tokens=True
#         )

#         return generated_response
