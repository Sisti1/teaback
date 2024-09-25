const Product=require('../models/Product');

exports.productList = async(req,res)=>{

    try{
        const productList = await Product.find({})
        res.status(200).json({
            status:"Success",
            data :productList,
    
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the data',
            error: error.message
        });
    }
   
}

exports.addProduct =async(req,res)=>{
    try{
        const addProduct = await Product.create(req.body);
        res.status(201).json({
            status:"Success",
            data:addProduct
        });  
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: 'An error occurred while adding the data',
            error: error.message
        });
    }
    
}

exports.delProduct = async (req, res) => {
    try {
        let deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deleteProduct) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${req.params.id} is not found`
            });
        }
        res.status(200).json({
            status: "Success",
            data: deleteProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the data',
            error: error.message
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updateProduct) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${req.params.id} is not found`
            });
        }
        res.status(200).json({
            status: "Success",
            data: updateProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the data',
            error: error.message
        });
    }
}

