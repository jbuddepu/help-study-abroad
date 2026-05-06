import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import SchoolIcon from '@mui/icons-material/School';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useUserStore } from '../../store/userStore';

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const fetchUserById = useUserStore((state) => state.fetchUserById);
  const loading = useUserStore((state) => state.loading);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadUser = async () => {
      const userData = await fetchUserById(id);
      setUser(userData);
    };

    loadUser();
  }, [fetchUserById, id]);

  const roleColor = user?.role === 'admin' ? 'error' : user?.role === 'moderator' ? 'warning' : 'success';

  return (
    <ProtectedRoute>
      <Layout>
        <Button variant="text" sx={{ mb: 2 }} onClick={() => router.push('/users')}>
          ← Back to Users
        </Button>

        {loading || !user ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar src={user.image} sx={{ width: 80, height: 80 }} />
                  </Box>
                  <Typography variant="h5" align="center">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="secondary" align="center" sx={{ mb: 2 }}>
                    @{user.username}
                  </Typography>
                  <Divider />
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CakeIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${user.age} years old`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WcIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.gender} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.university} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BloodtypeIcon />
                      </ListItemIcon>
                      <ListItemText primary={user.bloodGroup} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Address
                  </Typography>
                  <Typography>{user.address.address}</Typography>
                  <Typography>
                    {user.address.city}, {user.address.state}
                  </Typography>
                  <Typography>
                    {user.address.country} {user.address.postalCode}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Company
                  </Typography>
                  <Typography variant="h6">{user.company.name}</Typography>
                  <Typography>
                    {user.company.department}, {user.company.title}
                  </Typography>
                  <Typography>{user.company.address?.address}</Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Account
                  </Typography>
                  <Typography>Username: {user.username}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={user.role} color={roleColor} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
