import {useEffect, useState} from 'react';
import {Box, Button, TextField, Modal, Typography, CircularProgress} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {updateUser} from "../../util/services/UserService.jsx";
import useSessionStore from "../../stores/useSessionStore.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

export const UserModal = ({ open, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const getUser =  useSessionStore((state) => state.user);
    const showSnackbar = useSnackbarStore((state => state.showSnackbar));

    useEffect(() => {
        if (open) {
            setNewPassword("");
            setOldPassword("");
            setConfirmPassword("");
            setValidation({
                hasLowercase: false,
                hasUppercase: false,
                hasSpecialChar: false,
                hasMinLength: false,
                matchesWithOldPassword: true,
            });
        }
    }, [open, onClose]);

    const [validation, setValidation] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasSpecialChar: false,
        hasMinLength: false,
    });

    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);

        // Validate password requirements
        setValidation({
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasMinLength: password.length >= 8,
        });
    };

    const handleUpdate = async () => {
        if (
            !validation.hasLowercase ||
            !validation.hasUppercase ||
            !validation.hasSpecialChar ||
            !validation.hasMinLength
        ) {
            return;
        }

        const requestData = {
            id: getUser.id,
            name: name,
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        setLoading(true);
        const response = await updateUser(requestData);
        if (!response) {
            setLoading(false);
            return;
        }
        showSnackbar("success", "User updated successfully.")
        setNewPassword("");
        setOldPassword("");
        setConfirmPassword("");
        setLoading(false);
        onClose();
    };

    const getValidationFeedback = (isValid, text) => (
        <Box display="flex" alignItems="center" gap={0.5} >
            {isValid ? (
                <CheckCircleIcon fontSize="small" color="success" />
            ) : (
                <CancelIcon fontSize="small" color="error" />
            )}
            <Typography variant="body2" color={isValid ? 'success.main' : 'error.main'}>{text}</Typography>
        </Box>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="user-modal-title"
            aria-describedby="user-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
            }}>
                <Typography variant="h5" id="user-modal-title">User Settings</Typography>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        mt: 2,
                    }}
                >
                    <TextField
                        required
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Old password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                    />
                    <Box>
                        {getValidationFeedback(validation.hasLowercase, 'At least 1 small character')}
                        {getValidationFeedback(validation.hasUppercase, 'At least 1 uppercase character')}
                        {getValidationFeedback(validation.hasSpecialChar, 'At least 1 special character')}
                        {getValidationFeedback(validation.hasMinLength, 'At least 8 characters long')}
                    </Box>
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {loading ? (
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%', // Ensure it takes full height of the parent container
                                width: '100%',  // Ensure it takes full width of the parent container
                            }}
                        >
                            <CircularProgress />
                        </Box>
                        ) : (
                        <Button
                            sx={{mt: 2}}
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                            disabled={
                                !validation.hasLowercase ||
                                !validation.hasUppercase ||
                                !validation.hasSpecialChar ||
                                !validation.hasMinLength ||
                                newPassword !== confirmPassword
                            }
                        >
                            Update
                        </Button>
                        )}
                </Box>
            </Box>
        </Modal>
    );
};