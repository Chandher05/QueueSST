

for run in {1..100}; do
aws sqs send-message --queue-url 	https://sqs.ap-south-1.amazonaws.com/982303353204/dev-queueAssignment-Queue --message-body "$(( $RANDOM % 10 + 1 ))"
done