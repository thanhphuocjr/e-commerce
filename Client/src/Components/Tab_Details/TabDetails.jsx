import React, { useMemo } from 'react';
import './TabDetails.scss';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  return value;
};

const TabDetails = ({ product }) => {
  const rows = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      ['Category', product.category?.name || product.category_name],
      ['Brand', product.brand?.name || product.brand_name],
      ['SKU', product.sku],
      ['Stock', product.stock],
      ['Minimum order', product.minimum_order_quantity],
      ['Weight', product.weight ? `${product.weight} g` : null],
      [
        'Dimensions',
        product.dimensions
          ? `${product.dimensions.width || '-'} x ${product.dimensions.height || '-'} x ${product.dimensions.depth || '-'} cm`
          : product.width || product.height || product.depth
            ? `${product.width || '-'} x ${product.height || '-'} x ${product.depth || '-'} cm`
            : null,
      ],
      ['Warranty', product.warranty_information],
      ['Shipping', product.shipping_information],
      ['Return policy', product.return_policy],
      ['Availability', product.availability_status],
    ];
  }, [product]);

  return (
    <div className="tabDetails">
      <TableContainer component={Paper}>
        <Table aria-label="product details table">
          <TableBody>
            {rows.map(([name, value]) => (
              <TableRow key={name}>
                <TableCell component="th" scope="row" sx={{ width: '35%' }}>
                  <strong>{name}</strong>
                </TableCell>
                <TableCell>{formatValue(value)}</TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>No detail available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TabDetails;
