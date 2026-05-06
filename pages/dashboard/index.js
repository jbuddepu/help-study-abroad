import { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loader from '../../components/Loader';
import api from '../../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ data: usersData }, { data: productsData }, { data: categoriesData }] = await Promise.all([
        api.get('/users?limit=1&skip=0'),
        api.get('/products?limit=1&skip=0'),
        api.get('/products/category-list')
      ]);

      setStats({
        users: usersData.total,
        products: productsData.total,
        categories: categoriesData.length
      });
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <ProtectedRoute>
        <Layout>
          <Loader />
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h4">{stats.users}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total Users
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h4">{stats.products}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Total Products
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <CategoryIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h4">{stats.categories}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Categories
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
}
