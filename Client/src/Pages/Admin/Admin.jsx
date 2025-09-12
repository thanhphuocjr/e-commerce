import React, { useState, useEffect } from 'react';
import './Admin.scss';
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  RefreshCw,
  Shield,
  Calendar,
  Mail,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Clock,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Table,
  Type,
  Star,
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

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

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/admin/dashboard',
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      children: [
        { id: 'users-list', label: 'Danh sách Users', path: '/admin/users' },
        { id: 'users-create', label: 'Tạo User', path: '/admin/users/create' },
        {
          id: 'users-stats',
          label: 'Thống kê Users',
          path: '/admin/users/stats',
        },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      children: [
        {
          id: 'products-list',
          label: 'Danh sách sản phẩm',
          path: '/admin/products',
        },
        {
          id: 'products-create',
          label: 'Tạo sản phẩm',
          path: '/admin/products/create',
        },
        {
          id: 'products-categories',
          label: 'Danh mục',
          path: '/admin/products/categories',
        },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      children: [
        {
          id: 'orders-list',
          label: 'Danh sách đơn hàng',
          path: '/admin/orders',
        },
        {
          id: 'orders-pending',
          label: 'Đơn hàng chờ duyệt',
          path: '/admin/orders/pending',
        },
        {
          id: 'orders-completed',
          label: 'Đơn hàng hoàn thành',
          path: '/admin/orders/completed',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      path: '/admin/analytics',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      children: [
        {
          id: 'reports-sales',
          label: 'Báo cáo bán hàng',
          path: '/admin/reports/sales',
        },
        {
          id: 'reports-users',
          label: 'Báo cáo người dùng',
          path: '/admin/reports/users',
        },
        {
          id: 'reports-products',
          label: 'Báo cáo sản phẩm',
          path: '/admin/reports/products',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        {
          id: 'settings-general',
          label: 'Cài đặt chung',
          path: '/admin/settings/general',
        },
        {
          id: 'settings-email',
          label: 'Cài đặt email',
          path: '/admin/settings/email',
        },
        {
          id: 'settings-payment',
          label: 'Cài đặt thanh toán',
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

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (menuId, hasChildren = false) => {
    if (hasChildren) {
      toggleMenu(menuId);
    } else {
      setActiveMenu(menuId);
    }
  };

  // Filter users theo schema mới
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = user.status === 'active' && !user._destroy;
    } else if (filterStatus === 'inactive') {
      matchesStatus = user.status === 'inactive' && !user._destroy;
    } else if (filterStatus === 'blocked') {
      matchesStatus = user.status === 'blocked' && !user._destroy;
    } else if (filterStatus === 'deleted') {
      matchesStatus = user._destroy === true;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user._id)
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                _destroy: true,
                deletedAt: Date.now(),
                updatedAt: Date.now(),
              }
            : user
        )
      );
    }
  };

  const handleRestoreUser = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? {
              ...user,
              _destroy: false,
              deletedAt: null,
              updatedAt: Date.now(),
            }
          : user
      )
    );
  };

  const handlePermanentDelete = (userId) => {
    if (
      window.confirm(
        'Bạn có chắc muốn xóa vĩnh viễn user này? Hành động này không thể hoàn tác!'
      )
    ) {
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    }
  };

  const handleBlockUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn chặn user này?')) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: 'blocked',
                updatedAt: Date.now(),
              }
            : user
        )
      );
    }
  };

  const handleUnblockUser = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? {
              ...user,
              status: 'active',
              updatedAt: Date.now(),
            }
          : user
      )
    );
  };

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      fullName: '',
      role: 'user',
    });

    const handleSubmit = () => {
      if (!formData.fullName || !formData.email || !formData.password) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      if (formData.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        status: 'active',
        createdAt: Date.now(),
        updatedAt: null,
        lastLogin: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        deletedAt: null,
        _destroy: false,
      };

      setUsers((prev) => [newUser, ...prev]);
      setShowCreateModal(false);
      setFormData({ email: '', password: '', fullName: '', role: 'user' });
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 className="modal-title">Tạo User Mới</h3>
          <div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ tên *"
                className="form-input"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email *"
                className="form-input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Mật khẩu * (tối thiểu 6 ký tự)"
                className="form-input"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                Tạo User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <RefreshCw className="loading-icon" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isActive =
              activeMenu === item.id ||
              (item.children &&
                item.children.some((child) => activeMenu === child.id));

            return (
              <div key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id, hasChildren)}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {hasChildren && (
                    <div className="nav-arrow">
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </div>
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="nav-submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        className={`nav-sublink ${
                          activeMenu === child.id ? 'active' : ''
                        }`}
                        onClick={() => handleMenuClick(child.id)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="page-title">Quản lý User</h1>
              <p className="page-subtitle">
                Quản lý tài khoản người dùng hệ thống
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <UserPlus className="btn-icon" />
              <span>Tạo User Mới</span>
            </button>
          </div>
        </div>

        <div className="content-body">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-info">
                <p className="stat-label">Tổng Users</p>
                <p className="stat-value">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-icon">
                <UserCheck />
              </div>
              <div className="stat-info">
                <p className="stat-label">Hoạt động</p>
                <p className="stat-value">
                  {stats.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="stat-card stat-card-orange">
              <div className="stat-icon">
                <UserX />
              </div>
              <div className="stat-info">
                <p className="stat-label">Bị chặn</p>
                <p className="stat-value">
                  {stats.blockedUsers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="stat-card stat-card-red">
              <div className="stat-icon">
                <Trash2 />
              </div>
              <div className="stat-info">
                <p className="stat-label">Đã xóa</p>
                <p className="stat-value">
                  {stats.deletedUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Table */}
          <div className="data-table-container">
            <div className="table-header">
              <div className="table-search">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-filters">
                <select
                  className="filter-select"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="blocked">Bị chặn</option>
                  <option value="deleted">Đã xóa</option>``
                </select>
                <button className="btn btn-outline">
                  <Download className="btn-icon" />
                  Export
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>User</th>
                    <th>Liên hệ</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th className="actions-col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                        />
                      </td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.fullName}</div>
                            <div className="user-id">
                              ID: {user._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <Mail className="contact-icon" />
                            {user.email}
                          </div>
                          {user.lastLogin && (
                            <div className="contact-item">
                              <Clock className="contact-icon" />
                              Đăng nhập:{' '}
                              {new Date(user.lastLogin).toLocaleDateString(
                                'vi-VN'
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${user.role}`}>
                          <Shield className="badge-icon" />
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        {user._destroy ? (
                          <span className="badge badge-deleted">Đã xóa</span>
                        ) : (
                          <span className={`badge badge-${user.status}`}>
                            {user.status === 'active'
                              ? 'Hoạt động'
                              : user.status === 'inactive'
                              ? 'Không hoạt động'
                              : 'Bị chặn'}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar className="date-icon" />
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="action-btn action-btn-view"
                            title="Xem chi tiết"
                          >
                            <Eye />
                          </button>
                          {!user._destroy && (
                            <button
                              className="action-btn action-btn-edit"
                              title="Chỉnh sửa"
                            >
                              <Edit3 />
                            </button>
                          )}
                          {user._destroy ? (
                            <>
                              <button
                                onClick={() => handleRestoreUser(user._id)}
                                className="action-btn action-btn-restore"
                                title="Khôi phục"
                              >
                                <RefreshCw />
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(user._id)}
                                className="action-btn action-btn-delete"
                                title="Xóa vĩnh viễn"
                              >
                                <Trash2 />
                              </button>
                            </>
                          ) : (
                            <>
                              {user.status === 'blocked' ? (
                                <button
                                  onClick={() => handleUnblockUser(user._id)}
                                  className="action-btn action-btn-unblock"
                                  title="Bỏ chặn"
                                >
                                  <UserCheck />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBlockUser(user._id)}
                                  className="action-btn action-btn-block"
                                  title="Chặn user"
                                >
                                  <UserX />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="action-btn action-btn-delete"
                                title="Xóa"
                              >
                                <Trash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="table-pagination">
              <div className="pagination-info">
                Hiển thị <span>1-{filteredUsers.length}</span> trong tổng số{' '}
                <span>{filteredUsers.length}</span> kết quả
              </div>
              <div className="pagination-controls">
                <button className="pagination-btn">Trước</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">Sau</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && <CreateUserModal />}
    </div>
  );
};

export default AdminDashboard;
