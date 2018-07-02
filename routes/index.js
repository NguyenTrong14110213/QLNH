const express= require('express');
const app =express();
const mongoose =require('mongoose');
const config = require('./config/database');
const path = require('path');
const router= express.Router();

const server = app.listen(8080,()=>{
    console.log('Listening on port 8080');
})


const socket = require("socket.io");
const io = socket(server);

const authentication = require('./routes/authentication')(router,io);
const categoryFood = require('./routes/categoryFood')(router,io);
const foods = require('./routes/foods')(router,io);
const region = require('./routes/region')(router,io);
const table = require('./routes/table')(router,io);
const order = require('./routes/order')(router,io);
const bodyParser =require('body-parser');
const cors = require('cors');
const multer = require('multer');

// const upload = require('express-fileupload');

// app.use(upload()); // configure middleware


app.use(express.static("./public"));
app.use(cors({
    origin: 'http://localhost:4200'
}));

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err){
        console.log('Could NOT connect to database: ', err);
    } else{
        console.log('Connected to database: ' + config.db);
    }
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client/dist'));
app.use('/authentication', authentication);
app.use('/foods', foods); 
app.use('/categoryFood',categoryFood);
app.use('/region',region);
app.use('/table',table);
app.use('/order',order)
app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './public/foods')
    },
    filename: function (req, file, cb) {
       cb(null, file.originalname);
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage }).array('imgfood',10);

app.post("/uploadImageFood",(req, res) => {
    upload(req, res, (err)=>{
        if(err) {
            res.json({success :false, message:err});
        }else{
            res.json({success: true, message: 'Đã lưu hình ảnh!'});
        }
    });
});



io.on("connection", function(socket){
     console.log("co nguoi ket noi " + socket.id);
    
    // socket.on("client-loadCategoryFoods",(data)=>{
    //     console.log(data);
    //     io.sockets.emit("server-loadCategoryFoods", 'Cap nhat danh muc');
    // });
    // socket.on("client-loadFoods",(data)=>{
    //     console.log(data);
    //     io.sockets.emit("server-loadFoods", 'Cap nhat mon');
    // });
    // socket.on("client-loadRegions", (data)=>{
    //     console.log(data);
    //     io.sockets.emit("server-loadRegions", 'Cap nhan khu vuc');
    // });
    // socket.on("client-loadTables", (data)=>{
    //     console.log(data);
    //     io.sockets.emit("server-loadTables", 'Cap nhan ban');
    // })
    // socket.on("client-loadEmployee", (data)=>{
    //     console.log(data);
    //     io.sockets.emit("server-loadEmployee", 'Cap nhan nhan vien');
    // })
});

// const CategoryFood = require('./models/categoryFood')
// const cat1 = new CategoryFood({
//     id : "cat0001",
//     name: "Món nướng"
// })
// cat1.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const cat2 = new CategoryFood({
//     id : "cat0002",
//     name: "Cháo"
// })
// cat2.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const Food = require('./models/foods')
// const food1 = new Food({
//     id : "food00010001",
//     name: "Vịt quay Bắc Kinh",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0001",
//     description : "Vịt ta quay",
//     discount : 30000,
//     inventory : 100,
//     price_unit : 300000,
//     unit : "Con",
//     url_image : ["http://www.monngon.tv/uploads/images/2017/03/08/1a4bc3bdc29e70b4d58e8547eb95beac-cac-mon-vit-nuong-beo-ngay.png",
// "https://www.hoidaubepaau.com/wp-content/uploads/2015/12/hinh-anh-vit-quay-bac-kinh.jpg",
// "https://images.foody.vn/res/g19/181624/prof/s576x330/foody-mobile-vit-bk1-jpg-853-635820570349552171.jpg"]
// })
// food1.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const food2 = new Food({
//     id : "food00010002",
//     name: "Cá lóc nướng trui",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0001",
//     description : "Cá lóc nuôi nướng trui",
//     discount : 0,
//     inventory : 100,
//     price_unit : 50000,
//     unit : "Con",
//     url_image : ["http://vanhoamientay.com/wp-content/uploads/2015/06/ca-loc-nuong-trui.jpg",
// "http://www.monngon.tv/uploads/images/2017/04/20/5d8e499349db284f0535a82d5b9fb999-cach-lam-ca-loc-nuong-rom-slide.jpg",
// "https://www.hoidaubepaau.com/wp-content/uploads/2018/02/ca-loc-nuong-giay-bac.jpg"]
// })
// food2.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const food3 = new Food({
//     id : "food00010003",
//     name: "Heo quay",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0001",
//     description : "Heo sữa quay",
//     discount : 0,
//     inventory : 100,
//     price_unit : 135000,
//     unit : "kg",
//     url_image : ["https://www.heoquay.com/upload/blog/dia-chi-ban-heo-sua-quay-ngon-2.jpg",
// "http://flyfood.vn/Files/images/Heo-sua-quay-flyfood-5.png",
// "http://amthuchailua.vn/vnt_upload/news/11_2016/heo-sua-quay-hai-lua-cho-lon.jpg"]
// })
// food3.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const food4 = new Food({
//     id : "food00010004",
//     name: "Cháo cá lóc",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0002",
//     description : "Cháo cá lóc bỏ hành",
//     discount : 10000,
//     inventory : 100,
//     price_unit : 45000,
//     unit : "Tô",
//     url_image : ["https://giadinh.tv/wp-content/uploads/2016/08/cach-nau-chao-ca-loc-2.jpg",
// "http://mevaobep.com/wp-content/uploads/2015/10/giai-cam-cho-tre-voi-chao-ca-loc-01-575x335.jpg",
// "http://www.diachibotui.com/Thumbnail/ExtraLarge/Upload/2017/12/4/chao-ca-loc-636479936701558040.jpg"]
// })
// food4.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const food5 = new Food({
//     id : "food00010005",
//     name: "Cháo má heo",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0002",
//     description : "Cháo má heo luộc và nướng",
//     discount : 0,
//     inventory : 100,
//     price_unit : 35000,
//     unit : "Tô",
//     url_image : ["http://1.bp.blogspot.com/-UA1Nv-TIDUU/U2G1nqWSeuI/AAAAAAAAcbg/Vp0aI-X79ZA/s1600/_DSC3078.JPG",
// "https://images.foody.vn/res/g32/316948/prof/s576x330/foody-mobile-foody-mobile-c-jpg-8-792-636190581357211433.jpg",
// "https://images.foody.vn/res/g2/13988/s/foody-chao-ma-heo-138-c0ca0e23-180e-45b3-9c52-30c70bf15cc5-635385541271810726.jpg"]
// })
// food5.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const food6 = new Food({
//     id : "food00010006",
//     name: "Cháo lòng",
//     actived : true,
//     date_created: new Date('2018-01-12 20:00:00'),
//     category_id : "cat0002",
//     description : "Cháo lòng heo",
//     discount : 0,
//     inventory : 100,
//     price_unit : 30000,
//     unit : "Tô",
//     url_image : ["https://www.vntrip.vn/cam-nang/wp-content/uploads/2017/11/Capture-116.png",
// "https://media.foody.vn/images/khanhhuyenh2(5).jpg",
// "https://images.foody.vn/res/g25/245020/prof/s576x330/foody-mobile-foody-chao-long-hai--594-636014051026334282.jpg"]
// })
// food6.save((err) => {
//     if(err){
//         console.log('create new category food failed:error:'+err)
//     }else{
//         console.log('create new category food success')
//     }
// })

// const Region = require('./models/region')
// const region1 = new Region({
//     id :"region0001",
//     name:"Tầng 1",
//     description :"tầng 1",
//     actived:true
// })
// region1.save((err) => {
//     if(err){
//         console.log('create new region failed:error:'+err)
//     }else{
//         console.log('create new region success')
//     }
// })

// const region2 = new Region({
//     id :"region0002",
//     name:"Tầng 2",
//     description :"tầng 2",
//     actived:true
// })
// region2.save((err) => {
//     if(err){
//         console.log('create new region failed:error:'+err)
//     }else{
//         console.log('create new region success')
//     }
// })

// const Table = require('./models/tables')
// const table1 = new Table({
//     id :"table00010001",
//     region_id : "region0001",
//     order_id:"",
//     actived:true
// })
// table1.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })

// const table2 = new Table({
//     id :"table00010002",
//     region_id : "region0001",
//     order_id:"",
//     actived:true
// })
// table2.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })

// const table3 = new Table({
//     id :"table00010003",
//     region_id : "region0001",
//     order_id:"",
//     actived:true
// })
// table3.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })

// const table4 = new Table({
//     id :"table00010004",
//     region_id : "region0002",
//     order_id:"",
//     actived:true
// })
// table4.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })

// const table5 = new Table({
//     id :"table00010005",
//     region_id : "region0002",
//     order_id:"",
//     actived:true
// })
// table5.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })

// const table6 = new Table({
//     id :"table00010006",
//     region_id : "region0002",
//     order_id:"",
//     actived:true
// })
// table6.save((err) => {
//     if(err){
//         console.log('create new table failed:error:'+err)
//     }else{
//         console.log('create new table success')
//     }
// })
module.exports =io;