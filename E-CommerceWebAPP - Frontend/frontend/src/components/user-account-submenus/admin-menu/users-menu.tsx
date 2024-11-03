import React, { useEffect, useState } from 'react';
import { userData } from '../../../types/UserType';
import useUser from '../../../hooks/useUser';
import './users-menu.css';
import { getNumberOfDays } from '../../../utils/formatDataTime';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


const UsersMenu = () => {
  const [customers, setCustomers] = useState<userData[] | null>(null);
  const [distributors, setDistributors] = useState<userData[] | null>(null);
  const [showCustomers, setShowCustomers] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const { fetchUsers, editUserByAdmin,deleteUser } = useUser();

  useEffect(() => {
    fetchUsers().then((users) => {
      const customers = users?.filter((user) => user.role === 'customer');
      const distributors = users?.filter((user) => user.role === 'distributor');
      setCustomers(customers || null);
      setDistributors(distributors || null);
    });
  }, [fetchUsers]);
  const addressType = {
    country: 'country',
    county: 'county',
    city: 'city',
    street: 'street',
    number: 'number',
    zip: 'zip',
  };
  const handleEditClick = (userId: string) => {
    setEditingUserId(userId);
  };

  const handleFieldChange = (userId: string, field: string, value: string) => {
    if (userId === editingUserId) {
      if (showCustomers) {
        const updatedCustomers = customers?.map((user) => {
          if (user._id === userId) {
            if (field === 'isVerified') {
              return { 
                ...user, 
                customerInfo: { ...user.customerInfo, isVerified: value === 'true' } 
              };
            }
            return { ...user, [field]: value };
          }
          return user;
        });
        setCustomers(updatedCustomers || null);
      } else {
        const updatedDistributors = distributors?.map((user) => {
          if (user._id === userId) {
            if (field === 'isAuthorized') {
              return { 
                ...user, 
                distributorInfo: { ...user.distributorInfo, isAuthorized: value === 'true' } 
              };
            } 
  
            else if (field in addressType) {
              return {
                ...user,
                distributorInfo: {
                  ...user.distributorInfo,
                  address: { ...user.distributorInfo?.address, [field]: value },
                },
              };
            } 
           
            else {
              return { ...user, [field]: value };
            }
          }
          return user;
        });
       
        setDistributors(updatedDistributors || null);
      }
    }
  };

  const handleSaveEdit = () => {
    if (editingUserId) {
      const userToSave = showCustomers
        ? customers?.find((user) => user._id === editingUserId)
        : distributors?.find((user) => user._id === editingUserId);
      if (userToSave) {
        handleEdit(userToSave); 
      }
      setEditingUserId(null); 
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null); 
  };

  const handleEdit = (user: userData) => {
    const updates = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      country: user.distributorInfo?.address.country,
      county: user.distributorInfo?.address.county,
      city: user.distributorInfo?.address.city,
      street: user.distributorInfo?.address.street,
      number: user.distributorInfo?.address.number,
      zip: user.distributorInfo?.address.zip,
      CUI: user.distributorInfo?.CUI,
      phoneNumber: user.phoneNumber,
      customerInfo: user.customerInfo,
      distributorInfo: user.distributorInfo,
      isVerified: user.customerInfo?.isVerified,
      isAuthorized: user.distributorInfo?.isAuthorized,
    };
    editUserByAdmin(updates);
 
  };
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId).then(() => {
      fetchUsers().then((users) => {
        const customers = users?.filter((user) => user.role === 'customer');
        const distributors = users?.filter((user) => user.role === 'distributor');
        setCustomers(customers || null);
        setDistributors(distributors || null);
      });
    });
  };


  const renderUsersList = (users: userData[] | null) => {
    if (users) {
      const isDistributor = users[0].role === 'distributor';
    
      return (
        <>
          <div className={`users-table-header ${isDistributor ? 'distributor-header' : ''}`}>
            <div className="header-text">Actions</div>
            <div className="header-text">Name</div>
            <div className="header-text">Email</div>
            {isDistributor && <div className="header-text">CUI</div>}
            {isDistributor && <div className="header-text">Address</div>}
            {isDistributor && <div className="header-text">Phone Number</div>}
            <div className="header-text">Status</div>
            <div className="header-text">Member Since</div>
          </div>
          {users.map((user) => {
            const isEditing = editingUserId === user._id;
          
            return (
              <div key={user._id} className={`users-content ${isDistributor ? 'distributor-content' : ''}`}>
                <div className="user-text" >
                  <div className="edit-buttons">
                  <EditIcon onClick={() => handleEditClick(user._id)} />
                  { !isEditing &&
                  <DeleteIcon onClick={() => handleDeleteUser(user._id)} />
                  }
                  </div>  
                  {
                  isEditing && (
                   <div className="edit-buttons">
                      <SaveIcon onClick={handleSaveEdit} />
                        
                      <CloseIcon onClick={handleCancelEdit} />
                    </div>
                  )

                  }
                </div>
                <div className="user-text">
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => handleFieldChange(user._id, 'name', e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </div>
                <div className="user-text">
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.email}
                      onChange={(e) => handleFieldChange(user._id, 'email', e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </div>
                {isDistributor && (
                  <div className="user-text">
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.distributorInfo?.CUI || ''}
                        onChange={(e) => handleFieldChange(user._id, 'CUI', e.target.value)}
                      />
                    ) : (
                      user.distributorInfo?.CUI
                    )}
                  </div>
                )}
                {isDistributor && (
                  <div className="user-text user-text-address">
                    {isEditing ? (
                      <>
                        <p>
                          Country:{' '}
                          <input
                            type="text"
                            value={user.distributorInfo?.address.country || ''}
                            onChange={(e) => handleFieldChange(user._id, 'country', e.target.value)}
                          />
                        </p>
                        <p>
                          County:{' '}
                          <input
                            type="text"
                            value={user.distributorInfo?.address.county || ''}
                            onChange={(e) => handleFieldChange(user._id, 'county', e.target.value)}
                          />
                        
                        </p>
                         <p>
                          City:{' '}
                          <input
                            type="text"
                            value={user.distributorInfo?.address.city || ''}
                            onChange={(e) => handleFieldChange(user._id, 'city', e.target.value)}
                          />
                         </p>
                          <p>
                            Street:{' '}
                            <input
                              type="text"
                              value={user.distributorInfo?.address.street || ''}
                              onChange={(e) => handleFieldChange(user._id, 'street', e.target.value)}
                            />
                          </p>
                          <p>
                            Number:{' '}
                            <input
                              type="text"
                              value={user.distributorInfo?.address.number || ''}
                              onChange={(e) => handleFieldChange(user._id, 'number', e.target.value)}
                            />
                          </p>
                          <p>
                            Zip:{' '}
                            <input
                              type="text"
                              value={user.distributorInfo?.address.zip || ''}
                              onChange={(e) => handleFieldChange(user._id, 'zip', e.target.value)}
                            />
                          </p>
                      </>
                    ) : (
                      <>
                        <p>Country: {user.distributorInfo?.address.country}</p>
                        <p>County: {user.distributorInfo?.address.county}</p>
                        <p>City: {user.distributorInfo?.address.city}</p>
                        <p>Street: {user.distributorInfo?.address.street}</p>
                        <p>Number: {user.distributorInfo?.address.number}</p>
                        <p>Zip: {user.distributorInfo?.address.zip}</p>

                      </>
                    )}
                  </div>
                )}
                {isDistributor && (
                  <div className="user-text">
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.phoneNumber || ''}
                        onChange={(e) => handleFieldChange(user._id, 'phoneNumber', e.target.value)}
                      />
                    ) : (
                      user.phoneNumber ? user.phoneNumber : 'N/A'
                    )}
                  </div>
                )}
                <div className="user-text">
                  {
                    isEditing ? (
                      <>
                        <input
                          type="checkbox"

                          checked={user.role === 'customer' ? user.customerInfo?.isVerified : user.distributorInfo?.isAuthorized}
                          
                          onChange={(e) => handleFieldChange(user._id,  user.role === 'customer' ? 'isVerified' : 'isAuthorized', e.target.checked.toString())} 
                        />
                        
                      </>
                    ) : (
                      user.role === 'customer' ? (
                        user.customerInfo?.isVerified ? <VerifiedIcon /> : 'Not verified'
                      ) : (
                        user.distributorInfo?.isAuthorized ? <VerifiedIcon /> : 'Not authorized'
                      )
                    )
                      
                  }
                </div>
                <div className="user-text">
                  Member since: {getNumberOfDays(user.role === 'customer' ? user.customerInfo?.createdAt as string : user.distributorInfo?.createdAt as string)} days
                </div>
                
              </div>
            );
          })}
        </>
      );
    }
    return null;
  };

  const renderUsers = (type: string) => {
    if (type === 'customer') {
      return renderUsersList(customers);
    } else if (type === 'distributor') {
      return renderUsersList(distributors);
    }
  };

  return (
    <div className="users-menu-container">
      <header className="users-menu-header">
        <button className="users-menu-header-button" onClick={() => setShowCustomers(true)}>
          Customers
        </button>
        <button className="users-menu-header-button" onClick={() => setShowCustomers(false)}>
          Distributors
        </button>
      </header>
      <main className="users-menu-main">
        {showCustomers ? renderUsers('customer') : renderUsers('distributor')}
      </main>
    </div>
  );
};

export default UsersMenu;
