import mongoose, { Schema, Types} from 'mongoose'

interface ProductMetaDataInterface {
    productId: Types.ObjectId;
    url: string;
}

const ProductMetaDataSchema = new mongoose.Schema({
    productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true },
    url: {type: String, required: true}
})

const ProductMetaData = mongoose.model<ProductMetaDataInterface>('ProductMetaData', ProductMetaDataSchema);

export default ProductMetaData;