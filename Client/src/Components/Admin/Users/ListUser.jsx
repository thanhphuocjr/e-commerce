import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userService from '../../../Api/Admin/userService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await userService.getUsers({
        page,
        limit: pagination.itemsPerPage,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
      console.log('API response:', res);

      // Vì res = response.data (trả về từ userService)
      // và response có cấu trúc: { success, message, data: { data, pagination } }
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (event, newPage) => {
    fetchUsers(newPage + 1);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Total: 25 Users
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Cập nhật</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination.totalItems}
            page={pagination.currentPage - 1}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.itemsPerPage}
            rowsPerPageOptions={[pagination.itemsPerPage]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ListUser;
