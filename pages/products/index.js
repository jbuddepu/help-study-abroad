import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import { useProductStore } from '../../store/productStore';

const formatCategory = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const total = useProductStore((state) => state.total);
  const categories = useProductStore((state) => state.categories);
  const loading = useProductStore((state) => state.loading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const fetchCategories = useProductStore((state) => state.fetchCategories);
  const fetchByCategory = useProductStore((state) => state.fetchByCategory);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts(0, 12);
    fetchCategories();
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      setPage(1);
      searchProducts(debouncedQuery);
      return;
    }

    if (selectedCategory === 'all') {
      fetchProducts(0, limit);
    } else {
      fetchByCategory(selectedCategory);
    }
  }, [debouncedQuery, fetchByCategory, fetchProducts, limit, searchProducts, selectedCategory]);

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handleCategoryChange = useCallback(
    (event) => {
      const category = event.target.value;
      setSelectedCategory(category);
      setPage(1);
      setSearchQuery('');
      setDebouncedQuery('');
      if (category === 'all') {
        fetchProducts(0, limit);
      } else {
        fetchByCategory(category);
      }
    },
    [fetchByCategory, fetchProducts, limit]
  );

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      fetchProducts((value - 1) * limit, limit);
    },
    [fetchProducts, limit]
  );

  return (
    <ProtectedRoute>
      <Layout>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Products
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            label="Search products..."
            sx={{ flex: 1, minWidth: 200 }}
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((slug) => (
              <MenuItem key={slug} value={slug}>
                {formatCategory(slug)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {loading ? (
          <Loader />
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                color="primary"
                onChange={handlePageChange}
              />
            </Box>
          </>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
