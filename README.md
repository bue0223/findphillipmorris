# Find Philip Morris 2020


1. Create AWS Codecommit Repository
2. Install the AWS Elasticbeanstalk CLI.
3. Login into your AWS Console > Go to Elasticbeanstalk > Create a new environment > Select Web server environment >
   Fill up necessary fields. For Platform, choose NodeJS. Then click Create Environment
4. In your local repository, type eb init > Choose your AWS region server > Choose the elasticbeanstalk you just create > 
   Do you wish to continue with CodeCommit? (Y/n): Y > Choose the codecommit repository you created a while ago > Select branch
5. Push your local repository to AWS Codecommit
   Steps : 
   git add *
   git commit -m "commit message"
   git push
   
6. After successful commit to repository, type eb deploy.


// END //
