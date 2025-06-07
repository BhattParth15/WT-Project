const mongoose=require("mongoose");
const initData=require("./Project_Data.js");
const Listing=require('../models/Project_Listdata.js');

main()
.then(()=>{
    console.log("Connection To DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> ({...obj , owner:"67f4ebd11fc9f82d7cc1f83f"}));
    await Listing.insertMany(initData.data);
    console.log(initData.data)
    console.log("Data Was initialized");
};

initDB();
