import React, { useState, useEffect } from 'react';
import './Admin.scss';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

import { MdDashboard } from 'react-icons/md';
import { CiUser } from 'react-icons/ci';
import { FiSettings } from 'react-icons/fi';
import ListUser from '../../Components/Admin/Users/ListUser';
import CreateNew from '../../Components/Admin/Users/CreateNew';
import GetStats from '../../Components/Admin/Users/GetStats';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    deletedUsers: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('users');
  const [expandedMenus, setExpandedMenus] = useState(['users']);

  const contentMap = {
    dashboard: <div>📊 Dashboard Overview</div>,
    users: <div>👥 Manage Users (Parent)</div>,
    'users-list': <ListUser />,
    'users-create': <CreateNew />,
    'users-stats': <GetStats />,
    settings: <div>⚙️ Manage Settings (Parent)</div>,
    'settings-general': <div>🔧 Cài đặt chung</div>,
    'settings-email': <div>📨 Cài đặt Email</div>,
    'settings-payment': <div>💳 Cài đặt Thanh toán</div>,
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MdDashboard />,
      path: '/admin/dashboard',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <CiUser />,
      children: [
        { id: 'users-list', label: 'List Users', path: '/admin/users' },
        {
          id: 'users-create',
          label: 'Create New User',
          path: '/admin/users/create',
        },
        {
          id: 'users-stats',
          label: 'Static',
          path: '/admin/users/stats',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FiSettings />,
      children: [
        {
          id: 'settings-general',
          label: 'General Settings',
          path: '/admin/settings/general',
        },
        {
          id: 'settings-email',
          label: 'Email Setting',
          path: '/admin/settings/email',
        },
        {
          id: 'settings-payment',
          label: 'Payment Setting',
          path: '/admin/settings/payment',
        },
      ],
    },
  ];

  // Mock data theo schema
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeUsers: 1156,
        blockedUsers: 45,
        deletedUsers: 91,
      });

      setUsers([
        {
          _id: '507f1f77bcf86cd799439011',
          email: 'nguyenvanan@gmail.com',
          fullName: 'Nguyễn Văn An',
          role: 'user',
          status: 'active',
          createdAt: new Date('2024-01-15').getTime(),
          lastLogin: new Date('2024-03-10').getTime(),
          updatedAt: new Date('2024-03-10').getTime(),
          _destroy: false,
          deletedAt: null,
        },
        {
          _id: '507f1f77bcf86cd799439012',
          email: 'tranthibinh@gmail.com',
          fullName: 'Trần Thị Bình',
          role: 'admin',
          status: 'active',
          createdAt: new Date('2024-02-20').getTime(),
          lastLogin: new Date('2024-03-09').getTime(),
          updatedAt: new Date('2024-03-09').getTime(),
          _destroy: false,
          deletedAt: null,
        },
        {
          _id: '507f1f77bcf86cd799439013',
          email: 'levancuong@gmail.com',
          fullName: 'Lê Văn Cường',
          role: 'user',
          status: 'inactive',
          createdAt: new Date('2024-01-08').getTime(),
          lastLogin: new Date('2024-02-15').getTime(),
          updatedAt: new Date('2024-02-15').getTime(),
          _destroy: false,
          deletedAt: null,
        },
        {
          _id: '507f1f77bcf86cd799439014',
          email: 'phamthidung@gmail.com',
          fullName: 'Phạm Thị Dung',
          role: 'user',
          status: 'blocked',
          createdAt: new Date('2023-12-10').getTime(),
          lastLogin: new Date('2024-01-20').getTime(),
          updatedAt: new Date('2024-01-20').getTime(),
          _destroy: false,
          deletedAt: null,
        },
        {
          _id: '507f1f77bcf86cd799439015',
          email: 'hoangvannam@gmail.com',
          fullName: 'Hoàng Văn Nam',
          role: 'user',
          status: 'active',
          createdAt: new Date('2023-11-05').getTime(),
          lastLogin: new Date('2024-01-10').getTime(),
          updatedAt: new Date('2024-02-01').getTime(),
          _destroy: true,
          deletedAt: new Date('2024-02-01').getTime(),
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const [openMenus, setOpenMenus] = useState({
    user: false,
    settings: false,
  });

  const handleToggle = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };
  return (
    <div className="admin-dashboard d-flex">
      <div className="header d-flex w-100">
        <div className="name">Admin, Thanh Phuoc</div>
        <div className="text">Some Text Here</div>
      </div>
      <hr />
      <div className="body w-100 d-flex">
        <div className="sideBar">
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={<ListSubheader component="div">Menu</ListSubheader>}
          >
            {menuItems.map((menu) => (
              <React.Fragment key={menu.id}>
                <ListItemButton
                  onClick={() => {
                    if (menu.children) {
                      handleToggle(menu.id);
                    } else {
                      setActiveMenu(menu.id);
                    }
                  }}
                  className={activeMenu === menu.id ? 'active' : ''}
                >
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.label} />
                  {menu.children &&
                    (openMenus[menu.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>

                {menu.children && (
                  <Collapse
                    in={openMenus[menu.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {menu.children.map((child) => (
                        <ListItemButton
                          key={child.id}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            setActiveMenu(child.id);
                          }}
                          className={activeMenu === child.id ? 'active' : ''}
                        >
                          <ListItemIcon>
                            <StarBorder />
                          </ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </div>
        <div className="mainContent">
          {contentMap[activeMenu] || <div>Chọn menu để xem nội dung</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
