from transformers import pipeline

# Load pre-trained emotion detection pipeline
emotion_classifier = pipeline('text-classification', model="SamLowe/roberta-base-go_emotions")

# user_input = 'what\'s wrong with you'

# results = emotion_classifier(user_input,)

# labels = [result['label'] for result in results[0]]
# print("Labels:", labels)
# score = []
# for result in results[0]:
#     if result['score'] > 0.8:
#         score.append(result)
# print(score)

print("Test classification, type sentence below\n")

while True:
    # Get user input
    user_input = input("Enter a sentence: ")

    if user_input.lower() == 'exit':
        print('Bye!')
        break

    # Classify emotions
    results = emotion_classifier(user_input,)

    # Print the results
    print("Emotions detected:")
    print(results)
    # for result in results:
    #     print(f" - {result['label']}: {result['score']:.2f}")
