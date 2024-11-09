import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ProductsCard = ({ product }) => (
    <Card sx={{ height: 300 }}>
        <CardMedia
            component="img"
            sx={{height: "70%", width: "100%", objectFit: "cover"}}
            image={product.picture != null ? product.picture : `${import.meta.env.VITE_PUBLIC_URL}/defaultProductPic.jpeg`}
            alt={product.name}
        />
        <CardContent>
            <Typography variant="h6" component="div">
                {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
                ${product.price}
            </Typography>
        </CardContent>
    </Card>
);

export default ProductsCard;
