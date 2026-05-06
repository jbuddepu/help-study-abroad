import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import Loader from '../../components/Loader';
import UserTable from '../../components/UserTable';
import { useUserStore } from '../../store/userStore';

export default function UsersPage() {
  const router = useRouter();
  const users = useUserStore((state) => state.users);
  const total = useUserStore((state) => state.total);
  const loading = useUserStore((state) => state.loading);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const searchUsers = useUserStore((state) => state.searchUsers);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    fetchUsers(0, 10);
  }, [fetchUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      setPage(0);
      searchUsers(debouncedQuery);
      return;
    }

    setPage(0);
    fetchUsers(0, rowsPerPage);
  }, [debouncedQuery, fetchUsers, rowsPerPage, searchUsers]);

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handlePageChange = useCallback(
    (event, newPage) => {
      setPage(newPage);
      fetchUsers(newPage * rowsPerPage, rowsPerPage);
    },
    [fetchUsers, rowsPerPage]
  );

  // useCallback: stable function reference across renders,
  // prevents unnecessary child component re-renders
  const handleRowsPerPageChange = useCallback(
    (event) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      fetchUsers(0, newRowsPerPage);
    },
    [fetchUsers]
  );

  const handleViewUser = useCallback(
    (id) => {
      router.push(`/users/${id}`);
    },
    [router]
  );

  const userRows = useMemo(() => users, [users]);

  return (
    <ProtectedRoute>
      <Layout>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Users
        </Typography>

        <TextField
          fullWidth
          label="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        {loading ? (
          <Loader />
        ) : (
          <UserTable
            users={userRows}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onViewUser={handleViewUser}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
}
