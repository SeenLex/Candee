import React, { useState,useEffect } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FlagIcon from '@mui/icons-material/Flag';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SignpostIcon from '@mui/icons-material/Signpost';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import TitleIcon from '@mui/icons-material/Title';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DeleteIcon from '@mui/icons-material/Delete';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import './form.css';
import { Category } from '../../../types/CategoryType';
import MultiSelect from './multiSelect';


interface FormFieldProps {
  type: 'text' | 'email' | 'password' | 'checkbox' | 'tel' | 'number' | 'textarea' | 'select' | 'file' | 'category';
  label?: string;
  placeholder?: string;
  value: string | boolean | File[];
  onChange: (value: string | boolean | Category[] | File[]) => void;
  icon?: string;
  showVisibilityIcon?: boolean;
  categories?: Category[];
  initialSelections?: Category[];
}

const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  icon,
  showVisibilityIcon,
  categories,
  initialSelections,
}) => {
  
  const [showPassword, setShowPassword] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>(
    Array.isArray(value) ? value : [],
  );



  const renderIcon = () => {
    switch (icon) {
      case 'email': return <EmailIcon className='icon' />;
      case 'key': return <KeyIcon className='icon' />;
      case 'person': return <PersonIcon className='icon' />;
      case 'phone': return <PhoneIcon className='icon' />;
      case 'business': return <BusinessIcon className='icon' />;
      case 'description': return <DescriptionIcon className='icon' />;
      case 'flag': return <FlagIcon className='icon' />;
      case 'mailbox': return <MarkunreadMailboxIcon className='icon' />;
      case 'street': return <SignpostIcon className='icon' />;
      case 'county': return <ApartmentIcon className='icon' />;
      case 'city': return <LocationCityIcon className='icon' />;
      case 'pin': return <PinDropIcon className='icon' />;
      case 'category': return <CategoryIcon className='icon' />;
      case 'image': return <ImageIcon className='icon' />;
      case 'price': return <LocalOfferIcon className='icon' />;
      case 'stock': return <InventoryIcon className='icon' />;
      case 'product': return <TitleIcon className='icon' />;
      case  'storefront': return <AddBusinessIcon className='icon' />;
      case 'brand': return <BrandingWatermarkIcon className='icon' />;
      default: return null;
    }
  };
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedFiles(value);
     
    }
  }, [value]);

  const handleVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleCategoryChange = (selectedCategories: Category[]) => {
    onChange(selectedCategories);
  }
  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
    onChange(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
    onChange(newFiles.filter(Boolean));
  };

  const renderImageInput = (index: number) => {
    const file = selectedFiles[index];

    
   
    
    return (
      <div key={index} className="image-input-container">
        <input
          type="file"
          id={`image-input-${index}`}
          style={{ display: 'none' }}
          onChange={handleFileChange(index)}
          accept="image/*"
        />
        {file ? (
          <>
          <div className="image-preview">
            <img
              src={file instanceof File ? URL.createObjectURL(file) : file}
              alt={`Uploaded ${index + 1}`}
              onLoad={() => URL.revokeObjectURL(file instanceof File ? URL.createObjectURL(file) : file)}
            />
           
          </div>
           <div className="overlay" onClick={() => handleRemoveFile(index)}>
           <DeleteIcon />
         </div>
          </>
        ) : (
          <label htmlFor={`image-input-${index}`} className="add-image-button">
            <AddCircleOutlineIcon />
            <span>Image {index + 1}</span>
          </label>
        )}
      </div>
    );
  };
  return (
    <div className={`form-group-container-${type}`}>
      <div className="form-group">
        {renderIcon()}
        {type === 'checkbox' ? (
          <>
            <input
              type="checkbox"
              id={label}
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
            />
            <label htmlFor={label}>{label}</label>
          </>
        ) : type === 'textarea' ? (
          <textarea
            placeholder={placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : type === 'file' ? (
          <div className="file-upload-container">
            {[0, 1, 2, 3, 4].map(renderImageInput)}
          </div>
        )  : type === 'category' ? (
          <div className="category-selects">
            <MultiSelect categories={categories} onCategoriesSelected={handleCategoryChange}  initialSelections={initialSelections}/>
          </div>
        ) : (
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            min = {type === 'number' ? 0 : undefined}
            step={type === 'number' ? 0.01 : undefined}
            
          />
        )}
      </div>
      {showVisibilityIcon && type === 'password' && (
        <div className="visibility-icon" onClick={handleVisibility}>
          {showPassword ? <LockIcon /> : <LockOpenIcon />}
        </div>
      )}
    </div>
  );
};

export default FormField;