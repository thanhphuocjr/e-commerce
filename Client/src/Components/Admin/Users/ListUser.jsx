import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListUser.scss';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Chip,
  Tooltip,
  Skeleton,
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
import { ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material';
import userService from '../../../Api/Admin/userService';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const MotionTableRow = motion(TableRow);

// Skeleton component for table rows
const TableRowSkeleton = () => (
  <>
    <TableCell>
      <Skeleton variant="text" width={200} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={200} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={150} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={80} />
    </TableCell>
    <TableCell>
      <Skeleton variant="rectangular" width={60} height={24} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={120} />
    </TableCell>
    <TableCell>
      <Skeleton variant="text" width={120} />
    </TableCell>
  </>
);

// Skeleton component for stats
const StatsSkeleton = () => (
  <Box sx={{ width: '100%', typography: 'body1' }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    </Box>
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width={100} height={24} />
    </Box>
  </Box>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

const tableVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const statsVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [sortConfig, setSortConfig] = useState({ createdAt: 'DESC' });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [value, setValue] = React.useState('general');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    if (newValue === 'general') {
      fetchUsers(1); // không filter
    } else {
      fetchUsers(1, { status: newValue }); // filter theo status
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      let newOrder = 'ASC';
      if (prev[field] === 'ASC') newOrder = 'DESC';
      else if (prev[field] === 'DESC') newOrder = undefined;

      const updated = { ...prev };
      if (newOrder) updated[field] = newOrder;
      else delete updated[field];
      return updated;
    });
  };

  const fetchUsers = async (page = 1, filter = {}) => {
    try {
      setLoadingUsers(true);
      const sortString = Object.entries(sortConfig)
        .map(([key, order]) => `${key}:${order}`)
        .join(',');

      // Artificial delay for smooth transition
      if (!isInitialLoad) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const res = await userService.getUsers({
        page,
        limit: pagination.itemsPerPage,
        sort: sortString,
        ...filter,
      });

      setUsers(res.data.list);
      setPagination(res.data.pagination);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
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
    if (value === 'general') {
      fetchUsers(newPage + 1);
    } else {
      fetchUsers(newPage + 1, { status: value });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Box p={2}>
        <AnimatePresence mode="wait">
          {loadingStats ? (
            <motion.div
              key="stats-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StatsSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="stats-content"
              variants={statsVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChangeTab}>
                      <Tab label="general" value="general" />
                      <Tab label="active" value="active" />
                      <Tab label="inactive" value="inactive" />
                      <Tab label="blocked" value="blocked" />
                    </TabList>
                  </Box>
                  <TabPanel value="general">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography>Total: {stats.total}</Typography>
                    </motion.div>
                  </TabPanel>
                  <TabPanel value="active">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography>Active: {stats.active}</Typography>
                    </motion.div>
                  </TabPanel>
                  <TabPanel value="inactive">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography>Inactive: {stats.inactive}</Typography>
                    </motion.div>
                  </TabPanel>
                  <TabPanel value="blocked">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography>Blocked: {stats.blocked}</Typography>
                    </motion.div>
                  </TabPanel>
                </TabContext>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <hr />

        <motion.div variants={tableVariants} initial="hidden" animate="visible">
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ width: '100%' }}>
              <Table sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '5%' }}>ID</TableCell>
                    <TableCell
                      sx={{ width: '20%', cursor: 'pointer' }}
                      onClick={() => handleSort('email')}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        Email
                        <motion.div animate={{}} transition={{ duration: 0.2 }}>
                          {sortConfig['email'] ? (
                            sortConfig['email'] === 'ASC' ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          ) : (
                            <UnfoldMore fontSize="small" />
                          )}
                        </motion.div>
                      </motion.div>
                    </TableCell>
                    <TableCell
                      sx={{ width: '15%', cursor: 'pointer' }}
                      onClick={() => handleSort('fullName')}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        FullName
                        <motion.div animate={{}} transition={{ duration: 0.2 }}>
                          {sortConfig['fullName'] ? (
                            sortConfig['fullName'] === 'ASC' ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          ) : (
                            <UnfoldMore fontSize="small" />
                          )}
                        </motion.div>
                      </motion.div>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>Role</TableCell>
                    <TableCell sx={{ width: '10%' }}>Status</TableCell>
                    <TableCell
                      sx={{ width: '12.5%', cursor: 'pointer' }}
                      onClick={() => handleSort('createdAt')}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        Created At
                        <motion.div animate={{}} transition={{ duration: 0.2 }}>
                          {sortConfig['createdAt'] ? (
                            sortConfig['createdAt'] === 'ASC' ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          ) : (
                            <UnfoldMore fontSize="small" />
                          )}
                        </motion.div>
                      </motion.div>
                    </TableCell>
                    <TableCell
                      sx={{ width: '12.5%', cursor: 'pointer' }}
                      onClick={() => handleSort('updatedAt')}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        Updated At
                        <motion.div animate={{}} transition={{ duration: 0.2 }}>
                          {sortConfig['updatedAt'] ? (
                            sortConfig['updatedAt'] === 'ASC' ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          ) : (
                            <UnfoldMore fontSize="small" />
                          )}
                        </motion.div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence mode="wait">
                    {loadingUsers
                      ? // Skeleton rows
                        Array.from({ length: pagination.itemsPerPage }).map(
                          (_, index) => (
                            <MotionTableRow
                              key={`skeleton-${index}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <TableRowSkeleton />
                            </MotionTableRow>
                          )
                        )
                      : // Actual user rows
                        users.map((user, index) => (
                          <MotionTableRow
                            key={`user-${user.id}`}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={index}
                            whileHover={{
                              backgroundColor: '#f9f9ff',
                              scale: 1.005,
                              transition: { duration: 0.2 },
                            }}
                            layout
                            style={{
                              originY: 0,
                            }}
                          >
                            <TableCell>
                              <Tooltip title={user.id}>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  {user.id}
                                </motion.span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={user.email}>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.1 }}
                                >
                                  {user.email}
                                </motion.span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.15 }}
                              >
                                {user.fullName}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                              >
                                {user.role}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: index * 0.05 + 0.25,
                                  type: 'spring',
                                  stiffness: 200,
                                }}
                              >
                                {user.status}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.3 }}
                              >
                                {new Date(user.createdAt).toLocaleString()}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.35 }}
                              >
                                {new Date(user.updatedAt).toLocaleString()}
                              </motion.span>
                            </TableCell>
                          </MotionTableRow>
                        ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
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
            </motion.div>
          </Paper>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default ListUser;
