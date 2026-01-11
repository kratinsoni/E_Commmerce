## ASSIGNMENT_8_BACKEND 

- done with product addition
- user addition with two roles done
- admin middleware done
- userSchema.pre having issue with next() is not a function
- deletefromCloudinary operation also performed while updating      productImage
- adminSpecific functions built across different controllers

- cart model is not created user has field named cart having array of items 
- upon placing an order, we intialise cart as empty array and reduce stock with the quantity of item
- status of order is maintain 
- user expected to provide address upon every order execution
- order can be placed through cart only for now
- for individual product purchase, another function need to be architected
- dotenv config was injecting after cloudinary configuration module execution, due to script and type : module issue 
- how to manage admin request in usercontroller
- chaos in usercontroller and route to decide in which to put 
- Cart functionality in user controller
- unCalled import of user is taken in product and order for ref doubt
- Me route yet to be done
- COR_ORIGIN : localhost yet to be done
- isUser loggedin function not designed 
- ORDER DATE MENTIONED IN THE ASSIGNMENT IS NOT DONE YET


- get patch delete put issue , json issue in raw format

- item vs product in cart issue
- findoneandDelete returns deleted model too 
- FOR NOW ANY ADMIN CAN REMOVE PRODUCT AS WE ARE NOT CHECKING OWNER WHILE SEARCHING THE DELETED PRODUCT
- GETALLPRODUCT ISNOT REQUIRING ACCESS TOKEN
- WHENEVER WE LOGIN A USER ADMIN ACCESS TOKEN IS NOT ACCEPT, MEANS WHENEVER WE NEED ADMIN ACCESS TOKEN WE ARE FORCED TO LOGIN THEM FIRST
- IN MY CASE FOLDERPATH IS NOT REQUIRED AS THERE IS NO FOLDER PATH IN MY CLOUDINARY
- INTIALLY FORGOT TO ADD REFRESH TOKEN FIELD IN USER SCHEMA, GOT ISSUE WITH REFRESHING ACCESS TOKEN
- APP.USE CONSOLE LOGGED FOUND NEW KEYS OF OBJECT
