  
  
**Backend coding assignment - AWS**
**KloudMate Coding Assignment: NodeJs backend developer**

*Look at Working Diagram, (filename - figure) for overall picture*

My working solution -


 - SQS is loaded with messages from the POST function that invokes the
   lambda to load the Queue with "n" number of Messages.
  - SQS has a consumer Lambda that is triggered as and when messages appear onto the Queue
   - Takes messages upto a batch 10
   - Checks if a certain message has passed a condition
	   - If true - message is processed
	   - if false - sent back to the Queue with delay (for a total of 3 times)
	   - if condition is still not met - then the message is moved to DynamoDb
- DyanmoDb has an Get API (Tied to a Lambda Function) - to get all the results from the Queue.

  
  

 1. Below is the stack created :
    1 - A DynamoDB table
    2 - A SQS queue
    3 - Lambda functions
	    a) Consumer for the SQS
	    b) Loader for Lambda
	    c) Retrieve messages from DynamoDB

To run the program (make sure you have AWS CLI working)-

     npm start

Navigate to the broswer to open - 

> [console.sst.dev](console.sst.dev)

  

Step - 1

>     Invoke the POST function to load the SQS with messages

Step - 2

> You can watch the logs to observe the consumer log a message to
> succeed or to fail (moved back to the Queue to be retried or send to
> DynamoDB)

Step -3

> All failed messages can be retrieved from the DynamoDB from the GET
> API, GetFailedJobs. Which does a scan to retrieve all the jobs.


Learnings - 

**SST Dev**  	
Learning to deploy a stack from SST.  	
- To create AWS resources from the Stack declarations under the stack section
-  To Bind permissions to a stack, easier than access policies and IAM  
   roles created manually. 
  - To be able to do this quickly from the   
   comfort of your console, rather than having to jump across multiple  
   consoles and dashboards on the AWS Website.

**SQS**  	
- Fully managed message queuing for microservices, distributed systems, and serverless applications 
- The need for it to be in the serverless stack, to handle requests that might require some processing
- Different functionality available for SQS, delaying messages, setting attributes for meta information, retrying. What DLQs are.

**Lambda** 
- Deploying Lambda functions in SST
- Easy of assigning permissions 
- Having lambda in one single stack and assigning roles 

**DynamoDB** 
- Creating a table with ease, setting the unique identifies 
- Assigning functions to have access with that function 


