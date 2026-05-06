import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function ProductCard({ product }) {
  const router = useRouter();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.title}
        sx={{ objectFit: 'contain', bgcolor: 'grey.100', p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip label={product.category} size="small" variant="outlined" sx={{ mb: 1 }} />
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.title}
        </Typography>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', mt: 1 }}>${product.price}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <StarIcon sx={{ color: '#fbc02d', fontSize: 16 }} />
          <Typography variant="body2">{product.rating?.toFixed(1)}</Typography>
          <Typography variant="body2" color="text.secondary">
            ({product.reviews?.length || 0})
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.discountPercentage > 0 ? `-${product.discountPercentage}% off` : ''}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" size="small" onClick={() => router.push(`/products/${product.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

// React.memo: product cards only re-render when product prop changes
export default React.memo(ProductCard);
