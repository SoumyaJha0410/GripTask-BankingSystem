
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-soumya:root@cluster0.wp8ur.mongodb.net/banking",{useNewUrlParser:true});
const customerSchema=new mongoose.Schema({
  AccNo:String,
  Name:String,
  Email:String,
  Balance:Number
});

const transferSchema=new mongoose.Schema({
  Customer1:String,
  Customer1Balance:Number,
  Customer2:String,
  Customer2Balance:Number,
  TransferAmount:Number
})
const customers=mongoose.model("customers",customerSchema);

const transaction=mongoose.model("transaction",transferSchema);


app.get("/",function(req,res){
  res.render("home");
})
app.get("/viewCustomers",function(req,res){
   customers.find(function(err,custom){
     res.render("viewCustomers",{element:custom});
   })
 });
 app.get("/viewTransactions",function(req,res){
    transaction.find(function(err,custom){
      res.render("viewTransactions",{element:custom});
    })
  });
app.get("/transaction",function(req,res){
  customers.find(function(err,custom){
    res.render("transaction",{element:custom});
  })
})
app.post("/transaction",function(req,res){
  var customer1=req.body.user1;
  var customer2=req.body.user2;
  var money=Number(req.body.amount);

  var doc1;
  var doc2;
  var newUpdate1;
  var newUpdate2;
 customers.findOne({Name:customer1},function(err,doc){
   if(!err){
     doc1=doc;
     var update=doc1.Balance;
     if(update<money){
       res.render("transactionStatus",{message:"Insufficient Balance for transaction"});
     }else{
       newUpdate1=update-money;
       customers.updateOne({Name:customer1},{Balance:newUpdate1},function(err){
          if(!err){

          }
        })
        customers.findOne({Name:customer2},function(err,doc){
          if(!err){
            doc2=doc;
            var update=doc2.Balance;
            newUpdate2=update+money;
            customers.updateOne({Name:customer2},{Balance:newUpdate2},function(err){
               if(!err){

               }
             })
             var temp=new transaction({
               Customer1:customer1,
               Customer1Balance:newUpdate1,
               Customer2:customer2,
               Customer2Balance:newUpdate2,
               TransferAmount:money
             })
             transaction.insertMany(temp,function(err){
               if(!err){
               }
             })
          }
        })
 res.render("transactionStatus",{message:"Your Transaction is successfull !!"});
     }
     }

 })

})
app.get("/transactionStatus",function(req,res){

})
app.post("/viewCustomers",function(req,res){

})

app.listen(3000, function() {
  console.log("Server started successfully");
});
