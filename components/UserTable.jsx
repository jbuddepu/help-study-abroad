import React from 'react';
import {
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

function UserTable({
  users,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewUser
}) {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={user.image} alt={user.firstName}>
                    {user.firstName?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={user.gender}
                    color={user.gender === 'male' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.company?.name}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => onViewUser(user.id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}

// React.memo: prevents re-render when parent re-renders
// with unchanged users/loading props
export default React.memo(UserTable);
