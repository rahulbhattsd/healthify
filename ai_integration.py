from transformers import pipeline
import sys

# Initialize the text-generation pipeline
pl = pipeline("text-generation", model="medalpaca/medalpaca-7b", tokenizer="medalpaca/medalpaca-7b")

def get_ai_response(context, question):
    # Format the prompt with the context and question
    prompt = f"Context: {context}\n\nQuestion: {question}\n\nAnswer: "
    # Use the pipeline to generate the response
    answer = pl(prompt, max_length=150)  # Adjust max_length as needed
    return answer[0]['generated_text']

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <context> <question>")
        sys.exit(1)
    
    context = sys.argv[1]  # First argument: context
    question = sys.argv[2]  # Second argument: question
    print(get_ai_response(context, question))

