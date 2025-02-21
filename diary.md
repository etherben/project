TODO: 
how to allow uploading files to websites (also best framework for), converting data onto graphs and making them visually appealing.

30/09 - 3/10

Started project plan and researching
risk/mitigation and timetable completed

3/10 -11/10
Had meeting with supervisor
    - Main focus will be on security features and how i can show website is secure -- why would a customer risk info with no proof it will be kept safe
    - All reports must be done, time allocation is okay.
Project plan complete.

12/10
Created react front, next steps is to create a login page.


14/10
Created Title Bar and welcome message
Chosen colour shceme is light to darker light blue, white background for tabs, grey/black for writing

16/10
Finalised signup page design, need to start backend and create database for signup


17/10
Researching which servies to use, aswell as backend framework

18/10
Created login form, logic to switch between login and signup. All set to create and store accounts.
NEED TO FIX: Autofill background colour

21/10
Created relation schema diagram for database
Chosen spring boot for backend: why? - prefer to work in java, has built in support for REST apis, security and data access, can create custom API

22/10
Started on backend created spring boot maven project and sorted file structure

23/10 - 31/10
Not much done this week due to courseworks on other modules, Have linked backend and front end, allowing for use signup.

1/11
After meeting with a professional software engineer, decided to restructure the project.
front and back end will be ran from a docker container, eventually allowing for easy deployment, also keeping file structure to a professional standard.
Changing from maven to gradel as it has better dependency management, more flexable and more dynamic.
Using groovy not kotlin as its more compatable with gradel and java
java source 21, react front still.

Database will now be nosql and using mongoDB, primarily because data will not have many relationships, most relaationships will be formed around user.
data storage structure will be more comparable to a file structure 

FOCUS ON FUNCTIONALITY THIS TERM 

02/11-11/11
Dockerised entire project and have it working from containers. 

Researched further into using noSQL databse
Things to consider/remember:
why change? - most relationsships are only to user, structure more comparable to documents/file structure.
              easier to visualise. 
              better for unstructured data, such as data that will be applied to graphs.
              can handle high throughput for when uploading bank statements. 
              Easier to develop and maintain.
              easier setup for docker for persistant data, more efficient resource useage (only to consider with large datasets)

risks of changing- delay in workflow -- following feedback from report will take time from secuirty considerations 
                   hardware constraints? can take up alot of ram with large datasets -- design schema so only relevant fields are loaded
                   duplicate data? -- can be less resource intensive than creating multiple joins.


11/11 - 18/11
Sucessfully swapped over to nosql database, improved testing quality and file structure is significantly neater

19/11 - 27/11
Created endpoints for submitting transactions, submitting files and retreiving transactions based on userId
Things to consider - in db I didnt Embed transactions into user document as one user can have thousands of transactions. This allows for scalability.
Escpecially with 16mb document limit. 

13/01 - 19/01
Setup plan for second term, establish goals and research ideas on how to progress

20/01 - 26/01
Establish microservice architecture, separating backend into services and establishing communication between them

27/01 - 02/02
Created transaction page, cleared up mainpage and linked pages.

03/02 - 09/02
Not much done this week, basic bug fixing and test building.

09/02- 21/02
Research into Machine Learning algorithm to automatically categorise transactions, might not be doable in timeframe
Redesign and building of transactionpage to handle file submits





