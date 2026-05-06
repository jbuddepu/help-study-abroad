import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loader from '../../components/Loader';
import { useProductStore } from '../../store/productStore';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const loading = useProductStore((state) => state.loading);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadProduct = async () => {
      const productData = await fetchProductById(id);
      setProduct(productData);
      setSelectedImage(productData.thumbnail);
    };

    loadProduct();
  }, [fetchProductById, id]);

  if (loading || !product) {
    return (
      <ProtectedRoute>
        <Layout>
          <Loader />
        </Layout>
      </ProtectedRoute>
    );
  }

  const discountPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  const availabilityColor =
    product.availabilityStatus === 'Out of Stock'
      ? 'error'
      : product.availabilityStatus === 'Low Stock'
      ? 'success'
      : 'success';

  return (
    <ProtectedRoute>
      <Layout>
        <Button variant="text" sx={{ mb: 2 }} onClick={() => router.push('/products')}>
          ← Back to Products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 2, mb: 2 }}>
              <Box
                component="img"
                src={selectedImage}
                alt={product.title}
                sx={{ width: '100%', maxHeight: 350, objectFit: 'contain' }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {product.images.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    border:
                      selectedImage === img ? '2px solid' : '1px solid',
                    borderColor: selectedImage === img ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    p: 0.5,
                    cursor: 'pointer',
                    width: 72,
                    height: 72
                  }}
                >
                  <Box component="img" src={img} alt={product.title} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4">{product.title}</Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={product.category} color="primary" variant="outlined" />
              {product.brand && <Chip label={product.brand} variant="outlined" />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Typography variant="h4" color="primary">
                ${product.price}
              </Typography>
              {product.discountPercentage > 0 && (
                <>
                  <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${discountPrice}
                  </Typography>
                  <Chip label={`-${product.discountPercentage}% off`} color="error" size="small" />
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {Array.from({ length: 5 }).map((_, index) =>
                index < Math.round(product.rating) ? (
                  <StarIcon key={index} sx={{ color: '#fbc02d', fontSize: 18 }} />
                ) : (
                  <StarBorderIcon key={index} sx={{ color: 'grey.400', fontSize: 18 }} />
                )
              )}
              <Typography>{product.rating}/5</Typography>
              <Typography color="text.secondary">({product.reviews?.length || 0} reviews)</Typography>
            </Box>

            <Chip label={product.availabilityStatus} color={availabilityColor} sx={{ mt: 1 }} />

            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">{product.description}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Specifications</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>{product.sku}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight</TableCell>
                  <TableCell>{product.weight}g</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dimensions</TableCell>
                  <TableCell>
                    {product.dimensions?.width} × {product.dimensions?.height} × {product.dimensions?.depth}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Warranty</TableCell>
                  <TableCell>{product.warrantyInformation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shipping</TableCell>
                  <TableCell>{product.shippingInformation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Return Policy</TableCell>
                  <TableCell>{product.returnPolicy}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Min. Order</TableCell>
                  <TableCell>{product.minimumOrderQuantity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
}
