# Contact Management DApp

This decentralized application (DApp) implements a simple contact management system using Cartesi Rollups technology. Users can add and remove contacts, as well as list all stored contacts.

## Installation

1. Clone this repository:

2. Install dependencies:
   ```
   npm install
   ```

## Running the DApp

Start the DApp using the Cartesi Rollups environment. Refer to the Cartesi documentation for detailed instructions on how to run a Rollups DApp.

## Interacting with the DApp

### Sending Inputs (Advance Requests)

1. Add a contact:

   ```json
   {
     "type": "add",
     "name": "John Doe",
     "phone": "123-456-7890"
   }
   ```

2. Remove a contact:

   ```json
   {
     "type": "remove",
     "name": "John Doe"
   }
   ```

### Making Inspect Calls

To read the state without modifying it, use the following inspect route:

1. List all contacts:
   ```
   list
   ```

## Notes

- The DApp maintains an in-memory array of contacts, which resets when the DApp is restarted.
- All inputs and outputs are processed as hexadecimal strings and converted to/from UTF-8.
- If a contact is not found during removal, a message is logged but no error is thrown.
- Invalid routes in inspect calls will return a "route not implemented" message.
