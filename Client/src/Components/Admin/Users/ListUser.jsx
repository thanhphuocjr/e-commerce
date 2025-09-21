import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListUser.scss';
import { Chip, Tooltip } from '@mui/material';
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
import EllipsisTooltip from '../../../Helper/EllipsisTooltip';
import { ClassNames } from '@emotion/react';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchUsers = async (page = 1) => {
    try {
      setLoadingUsers(true);
      const res = await userService.getUsers({
        page,
        limit: pagination.itemsPerPage,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
      setUsers(res.data.list);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await userService.getStats();
      setStats(res.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchStats();
  }, []);

  const handleChangePage = (event, newPage) => {
    fetchUsers(newPage + 1);
  };

  return (
    <Box p={2}>
      {loadingStats ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Total: {stats.total} Users
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <Chip label={`Active: ${stats?.active ?? 0}`} color="success" />
            <Chip label={`Inactive: ${stats?.inactive ?? 0}`} color="warning" />
            <Chip label={`Blocked: ${stats?.blocked ?? 0}`} color="error" />
          </Box>
        </>
      )}

      {loadingUsers ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ width: '100%' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%' }}>ID</TableCell>
                  <TableCell sx={{ width: '20%' }}>Email</TableCell>
                  <TableCell sx={{ width: '15%' }}>FullName</TableCell>
                  <TableCell sx={{ width: '10%' }}>Role</TableCell>
                  <TableCell sx={{ width: '10%' }}>Status</TableCell>
                  <TableCell sx={{ width: '12.5%' }}>Created at</TableCell>
                  <TableCell sx={{ width: '12.5%' }}>Updated at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Tooltip title={user.id}>
                        <span>{user.id}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.email}>
                        <span>{user.email}</span>
                      </Tooltip>
                    </TableCell>
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
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              bgcolor: 'background.paper',
              zIndex: 2,
              borderTop: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <TablePagination
              component="div"
              count={pagination.totalItems}
              page={pagination.currentPage - 1}
              onPageChange={handleChangePage}
              rowsPerPage={pagination.itemsPerPage}
              rowsPerPageOptions={[pagination.itemsPerPage]}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ListUser;
