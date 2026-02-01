import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AdvancedSearch = ({
    show,
    onHide,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onSearch,
    required
}) => {
    return (
        <Dialog 
            open={show} 
            onClose={onHide} 
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.65)', 
                    backdropFilter: 'blur(15px)', 
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Range Date Search</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
                        {required && (
                            <Typography color="error" fontWeight="bold">
                                Both the fields are required to search*
                            </Typography>
                        )}
                        <Box display="flex" alignItems="center" gap={2} p={2}>
                            <DatePicker
                                label="Start Date"
                                value={startDate || null}
                                onChange={onStartDateChange}
                                views={['month', 'year']}
                                slotProps={{ 
                                    textField: { 
                                        variant: 'outlined',
                                        sx: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1 } 
                                    } 
                                }}
                            />
                            <Typography fontWeight="bold">to</Typography>
                             <DatePicker
                                label="End Date"
                                value={endDate || null}
                                onChange={onEndDateChange}
                                views={['month', 'year']}
                                slotProps={{ 
                                    textField: { 
                                        variant: 'outlined',
                                        sx: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1 }
                                    } 
                                }}
                            />
                        </Box>
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                 <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={onSearch}
                    sx={{ borderRadius: '20px', paddingX: 4, textTransform: 'none', fontSize: '1.1rem' }}
                >
                    Search
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdvancedSearch;
