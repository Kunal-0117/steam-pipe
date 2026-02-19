const MESSAGES = {
  DELETE: {
    SUCCESS: {
      TITLE: 'Deletion Successful',
      DESCRIPTION: 'The item has been deleted successfully.',
    },
    ERROR: {
      TITLE: 'Error Deleting',
      DESCRIPTION: 'An error occurred while deleting.',
    },
    CONFIRM: {
      TITLE: 'Delete This?',
      DESCRIPTION: 'Are you sure you want to delete this?',
    },
    UNAUTHORIZED: {
      TITLE: 'Access Denied',
      DESCRIPTION: 'You do not have permission to delete this.',
    },
  },
  CREATE: {
    CONFIRM: {
      TITLE: 'Confirm Creation',
      DESCRIPTION: 'Are you sure you want to create this?',
    },
    SUCCESS: {
      TITLE: 'Creation Successful',
      DESCRIPTION: 'The item has been created successfully.',
    },
    ERROR: {
      TITLE: 'Creation Error',
      DESCRIPTION: 'There was an issue while creating.',
    },
    UNAUTHORIZED: {
      TITLE: 'Access Denied',
      DESCRIPTION: 'You do not have permission to create this.',
    },
  },
  UPDATE: {
    CONFIRM: {
      TITLE: 'Confirm Update',
      DESCRIPTION: 'Are you sure you want to update this?',
    },
    SUCCESS: {
      TITLE: 'Update Successful',
      DESCRIPTION: 'The item has been updated successfully.',
    },
    ERROR: {
      TITLE: 'Update Error',
      DESCRIPTION: 'An error occurred while updating.',
    },
    UNAUTHORIZED: {
      TITLE: 'Access Denied',
      DESCRIPTION: 'You do not have permission to update this.',
    },
  },
  GENERAL: {
    CONFIRM: {
      TITLE: 'Confirm Action',
      DESCRIPTION: 'Are you sure you want to proceed with this?',
    },
    SUCCESS: {
      TITLE: 'Success!',
      DESCRIPTION: 'The action was completed successfully.',
    },
    ERROR: {
      TITLE: 'Error!',
      DESCRIPTION: 'Something went wrong. Please try again later.',
    },
    UNAUTHORIZED: {
      TITLE: 'Access Denied',
      DESCRIPTION: 'You do not have permission to perform this.',
    },
  },
};

export default MESSAGES;
