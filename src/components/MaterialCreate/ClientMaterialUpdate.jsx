"use client";
import React, { useState, memo, useEffect, useCallback, useRef } from "react";
import {
  FiPlus,
  FiMinus,
} from "react-icons/fi";

// Separate component for ItemRow for better performance
const ItemRow = memo(({ item, index, onRemove, onInputChange, isLastItem, errors }) => {
  const total = item.qty * item.price;
  const gstAmount = total * (item.gst / 100);
  const subtotal = total + gstAmount;

  
  return (
    <>
      <tr>
        <td className="text-center align-middle">{index + 1}</td>
        <td>
          <input
            type="text"
            placeholder="Product Name *"
            className={`form-control form-control-sm ${errors?.product ? 'is-invalid' : ''}`}
            value={item.product}
            onChange={(e) => onInputChange(item.id, 'product', e.target.value)}
          />
          {errors?.product && (
            <div className="invalid-feedback d-block small">{errors.product}</div>
          )}
        </td>
        <td>
          <input
            type="text"
            placeholder="Brand Name"
            className="form-control form-control-sm"
            value={item.brand}
            onChange={(e) => onInputChange(item.id, 'brand', e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            className={`form-control form-control-sm ${errors?.qty ? 'is-invalid' : ''}`}
            style={{ width: '80px' }}
            min="1"
            value={item.qty}
            onChange={(e) => onInputChange(item.id, 'qty', parseInt(e.target.value) || 1)}
          />
          {errors?.qty && (
            <div className="invalid-feedback d-block small">{errors.qty}</div>
          )}
        </td>
        <td>
          <div className="input-group input-group-sm">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              className={`form-control ${errors?.price ? 'is-invalid' : ''}`}
              step="0.01"
              min="0"
              value={item.price}
              onChange={(e) => onInputChange(item.id, 'price', parseFloat(e.target.value) || 0)}
            />
          </div>
          {errors?.price && (
            <div className="invalid-feedback d-block small">{errors.price}</div>
          )}
        </td>
        <td className="text-center align-middle">
            <input
              type="number"
              placeholder="GST %"
              className="form-control"
              style={{ width: '80px' }}
              min="0"
              max="100"
              step="0.1"
              value={item.gst}
              onChange={(e) => onInputChange(item.id, 'gst', parseFloat(e.target.value))}
            />
        </td>
        <td className="text-center align-middle">
          ₹{total.toFixed(2)}
        </td>
        <td className="text-center align-middle">
          ₹{gstAmount.toFixed(2)}
        </td>
        <td className="text-center align-middle">
          ₹{subtotal.toFixed(2)}
        </td>
        <td className="text-center align-middle borderBottom-red">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => onRemove(item.id, e)}
            disabled={isLastItem}
            title={isLastItem ? "Cannot remove the only item" : "Remove item"}
          >
            <FiMinus />
          </button>
        </td>
      </tr>
    </>
  );
});

ItemRow.displayName = "ItemRow";

const ClientMaterialUpdate = ({
  clientData,
  month,
  year,
  projectType,
  onProcessDataSubmit,
}) => {
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});
  // Initialize with a valid default item - better defaults
  const [items, setItems] = useState([
    {
      id: 1,
      product: '',
      qty: 1,
      brand: '',
      price: 0,
      gst: 9,
    }
  ]);

  // Use a ref to track if we've already provided the function
  const hasProvidedFunctionRef = useRef(false);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addItem = (e) => {
    e?.preventDefault();
    
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const newItem = {
      id: newId,
      product: '',
      qty: 1,
      brand: '',
      price: 0,
      gst: 9,
    };
    setItems([...items, newItem]);
    // Clear any validation errors when adding new item
    setValidationErrors({});
  };

  const removeItem = useCallback((id, e) => {
    e?.preventDefault();
    
    if (items.length > 1) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // Clear validation errors for removed item
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    } else {
      setNotification({
        type: 'error',
        message: 'At least one item is required'
      });
    }
  }, [items]);

  const handleInputChange = useCallback((id, field, value) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newValue = field === 'product' || field === 'brand' 
            ? value 
            : (field === 'qty' ? parseInt(value) || 0 : parseFloat(value) || 0);
          
          return {
            ...item,
            [field]: newValue
          };
        }
        return item;
      })
    );
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[id] && validationErrors[id][field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          delete newErrors[id][field];
          // Remove the entire item error object if no errors left
          if (Object.keys(newErrors[id]).length === 0) {
            delete newErrors[id];
          }
        }
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Calculate totals from items
  const { subTotal, totalGST, grandTotal } = items.reduce((acc, item) => {
    const total = item.qty * item.price;
    const gstAmount = total * (item.gst / 100);
    const subtotal = total + gstAmount;
    
    return {
      subTotal: acc.subTotal + total,
      totalGST: acc.totalGST + gstAmount,
      grandTotal: acc.grandTotal + subtotal
    };
  }, { subTotal: 0, totalGST: 0, grandTotal: 0 });

  // Validate all items before submission - memoize with useCallback
  const validateItems = useCallback(() => {
    const errors = {};
    let hasErrors = false;
    
    items.forEach((item) => {
      const itemErrors = {};
      
      // Check product name
      if (!item.product || item.product.trim() === '') {
        itemErrors.product = "Product name is required";
        hasErrors = true;
      }
      
      // Check quantity
      if (item.qty <= 0) {
        itemErrors.qty = "Quantity must be greater than 0";
        hasErrors = true;
      }
      
      // Check price
      if (item.price <= 0) {
        itemErrors.price = "Price must be greater than 0";
        hasErrors = true;
      }
      
      // Only add to errors if there are any for this item
      if (Object.keys(itemErrors).length > 0) {
        errors[item.id] = itemErrors;
      }
    });
    
    setValidationErrors(errors);
    return !hasErrors;
  }, [items]);

  // Function to submit the invoice data to API - memoize with useCallback
  const handleSubmitInvoice = useCallback(async () => {
    console.log("📝 Submitting invoice with items:", items);
    
    // First validate all items
    if (!validateItems()) {
      setNotification({
        type: 'error',
        message: 'Please fill all required fields with valid values'
      });
      return {
        success: false,
        message: 'Please fill all required fields with valid values'
      };
    }
    
    // Check if we have valid client data
    if (!clientData?.label || !clientData?.value) {
      setNotification({
        type: 'error',
        message: 'Client information is missing'
      });
      return {
        success: false,
        message: 'Client information is missing'
      };
    }
    
    if (!month || !year) {
      setNotification({
        type: 'error',
        message: 'Month and year are required'
      });
      return {
        success: false,
        message: 'Month and year are required'
      };
    }
    
    // Prepare API request data
    const requestData = {
      project_type: projectType || 'material',
      client: clientData.label,
      client_id: clientData.value,
      month: month,
      year: year,
      items: items.map(item => {
        const total = item.qty * item.price;
        const gstAmount = total * (item.gst / 100);
        const itemSubTotal = total + gstAmount;
        
        return {
          product: item.product.trim(),
          brand: item.brand.trim(),
          qty: item.qty,
          price: item.price,
          gst_percentage: item.gst,
          total: total,
          gst_amount: gstAmount,
          sub_total: itemSubTotal
        };
      }),
      summary: {
        sub_total_totals: subTotal,
        sub_total_gst_amount: totalGST,
        sub_total_sub_total: grandTotal
      }
    };
    
    console.log("📦 Invoice requestData:", requestData);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({
        type: 'error',
        message: 'Authentication token not found. Please login again.'
      });
      return {
        success: false,
        message: 'Authentication token not found. Please login again.'
      };
    }
    
    try {
      // Send data to API
      const response = await fetch('https://green-owl-255815.hostingersite.com/api/material/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await response.json();
      console.log("📡 API Response:", result);
      
      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Materials saved successfully!'
        });
        return {
          success: true,
          message: 'Materials saved successfully!',
          data: result
        };
      } else {
        const errorMsg = result.message || result.error || 'Failed to submit materials';
        setNotification({
          type: 'error',
          message: errorMsg
        });
        return {
          success: false,
          message: errorMsg
        };
      }
    } catch (error) {
      console.error('❌ Error submitting materials:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to submit materials. Please try again.'
      });
      return {
        success: false,
        message: error.message || 'Failed to submit materials. Please try again.'
      };
    }
  }, [clientData, items, month, year, projectType, subTotal, totalGST, grandTotal, validateItems]);

  // Provide process function to parent - only run once or when items change
  useEffect(() => {
    // If we've already provided the function and items haven't changed meaningfully, skip
    if (hasProvidedFunctionRef.current) {
      return;
    }
    
    const processFunction = async () => {
      console.log("🔄 Processing materials data...");
      const result = await handleSubmitInvoice();
      console.log("✅ Process result:", result);
      return result;
    };
    
    if (onProcessDataSubmit) {
      console.log("📤 Providing process function to parent");
      onProcessDataSubmit(processFunction);
      hasProvidedFunctionRef.current = true;
    }
    
    // Cleanup function - reset the ref when component unmounts
    return () => {
      hasProvidedFunctionRef.current = false;
      if (onProcessDataSubmit) {
        onProcessDataSubmit(null);
      }
    };
  }, [onProcessDataSubmit, handleSubmitInvoice]);

  const DebugPanel = () => (
    <div className="debug-panel p-3 mb-3 bg-light border rounded">
      <h6 className="fw-bold mb-2">Client Data</h6>
      <div className="row">
        <div className="col-md-3">
          <small className="text-muted">Project Type:</small>
          <div className="fw-semibold">{projectType || "Not selected"}</div>
        </div>
        <div className="col-md-3">
          <small className="text-muted">Client:</small>
          <div className="fw-semibold">{clientData?.label || "Not selected"}</div>
        </div>
        <div className="col-md-3">
          <small className="text-muted">Month:</small>
          <div className="fw-semibold">{month || "Not selected"}</div>
        </div>
        <div className="col-md-3">
          <small className="text-muted">Year:</small>
          <div className="fw-semibold">{year || "Not selected"}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <DebugPanel />
      
      {notification.message && (
        <div className={`alert alert-${notification.type === 'error' ? 'danger' : notification.type === 'success' ? 'success' : 'info'} mb-3`}>
          <div className="d-flex justify-content-between align-items-center">
            <span>{notification.message}</span>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setNotification({ type: '', message: '' })}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      
      {/* Items Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-4">
            <h6 className="fw-bold mb-1">Add Materials:</h6>
            <span className="fs-12 text-muted">Add materials to invoice (Product Name, Quantity, and Price are required)</span>
          </div>
          
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Product *</th>
                  <th className="text-center">Brand</th>
                  <th className="text-center">Qty *</th>
                  <th className="text-center">Price *</th>
                  <th className="text-center">GST (%)</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">GST Amount</th>
                  <th className="text-center">Sub Total</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={removeItem}
                    onInputChange={handleInputChange}
                    isLastItem={items.length === 1}
                    errors={validationErrors[item.id]}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-end fw-bold">Sub Total:</td>
                  <td className="text-center fw-bold">₹{subTotal.toFixed(2)}</td>
                  <td className="text-center fw-bold">₹{totalGST.toFixed(2)}</td>
                  <td className="text-center fw-bold">₹{grandTotal.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                onClick={addItem}
              >
                <FiPlus /> Add Item
              </button>
            </div>
            <div className="text-end">
              <div className="fs-12 text-muted">Total Items: {items.length}</div>
              <div className="h4 fw-bold text-primary">Grand Total: ₹{grandTotal.toFixed(2)}</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ClientMaterialUpdate;