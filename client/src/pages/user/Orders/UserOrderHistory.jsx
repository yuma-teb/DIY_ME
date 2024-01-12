import { Container, Paper, Typography } from '@mui/material';
import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useFetchAllOrdersQuery } from '../../../redux/store';
import StatusType from './StatusStyle';
function OrderHistory() {
  const user = JSON.parse(localStorage.getItem('user'));
  const { data, isLoading, error } = useFetchAllOrdersQuery(user?._id);
  const order = data?.data?.docs;
  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '56px' }}></div>
      <Container>
        <div className="order-summary-container">
          <h1 className="label-order-history">Order History</h1>
          {order?.map((item) => (
            <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem
                alignItems="flex-start"
                sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
                <div className="status-order">
                  <h1 className="order-id">OrderID:{item?._id}</h1>
                  <h1 style={StatusType(item.status)}>{item.status}</h1>
                </div>
                {item?.orderItems.map((element) => (
                  <>
                    <div className="product-summary">
                      <ListItemText
                        sx={{ marginLeft: '15px' }}
                        primary={element.variations.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {element.variations.attribute}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      <ListItemText
                        primary={`x${element.quantity}`}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      />
                    </div>
                  </>
                ))}
              </ListItem>
            </Paper>
          ))}
        </div>
      </Container>
    </>
  );
}

export default OrderHistory;
