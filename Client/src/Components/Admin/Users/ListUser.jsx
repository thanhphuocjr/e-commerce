import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListUser.scss';
import { Chip, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material';
import userService from '../../../Api/Admin/userService';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
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
  const [stats, setStats] = useState({});
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [value, setValue] = React.useState('general');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSort = (field) => {
    setSortConfig((prev) => {
      let newOrder = 'ASC';
      if (prev.sortBy === field && prev.sortOrder === 'ASC') {
        newOrder = 'DESC';
      }
      return { sortBy: field, sortOrder: newOrder };
    });
  };
  const fetchUsers = async (page = 1) => {
    try {
      setLoadingUsers(true);
      const res = await userService.getUsers({
        page,
        limit: pagination.itemsPerPage,
        search: '',
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
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
  useEffect(() => {
    fetchUsers(1);
  }, [sortConfig]);

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
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="general" value="general" />
                  <Tab label="active" value="active" />
                  <Tab label="inactive" value="inactive" />
                  <Tab label="blocked" value="blocked" />
                </TabList>
              </Box>
              <TabPanel value="general">
                <Typography>Total: {stats.total}</Typography>
              </TabPanel>
              <TabPanel value="active">
                <Typography>Active: {stats.active}</Typography>
              </TabPanel>
              <TabPanel value="inactive">
                <Typography>Inactive: {stats.inactive}</Typography>
              </TabPanel>
              <TabPanel value="blocked">
                <Typography>Blocked: {stats.blocked}</Typography>
              </TabPanel>
            </TabContext>
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
                  <TableCell
                    sx={{ width: '20%' }}
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {sortConfig.sortBy === 'email' ? (
                      sortConfig.sortOrder === 'ASC' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : (
                      <UnfoldMore fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ width: '15%' }}
                    onClick={() => handleSort('fullName')}
                  >
                    FullName
                    {sortConfig.sortBy === 'fullName' ? (
                      sortConfig.sortOrder === 'ASC' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : (
                      <UnfoldMore fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>Role</TableCell>
                  <TableCell sx={{ width: '10%' }}>Status</TableCell>
                  <TableCell
                    sx={{ width: '12.5%' }}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At
                    {sortConfig.sortBy === 'createdAt' ? (
                      sortConfig.sortOrder === 'ASC' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : (
                      <UnfoldMore fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ width: '12.5%' }}
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated At
                    {sortConfig.sortBy === 'updatedAt' ? (
                      sortConfig.sortOrder === 'ASC' ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    ) : (
                      <UnfoldMore fontSize="small" />
                    )}
                  </TableCell>
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
