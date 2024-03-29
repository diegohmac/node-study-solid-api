# App

GymPass style API.

## FRs (Functional Requirements)
- [x] It should allow for user registration.
- [x] It should allow user to authenticate.
- [x] It should retrieve a authenticated user.
- [x] It should retrieve the amount of check-ins of the authenticated user.
- [x] It should retrieve the check-ins history.
- [x] It should allow to search for near gyms up to 10km.
- [x] It should allow the user to search for gyms by name.
- [x] It should allow to check-in on a gym.
- [x] It should allow to validate a user's check-in.
- [x] It should allow to register a gym.

## BRs (Business Rules)
- [x] It should not allow the user to register with duplicated email.
- [x] It should not allow the user to check-in more than once each day.
- [x] It should only allow the user to check-in when within 100m of the gym.
- [x] It should allow a check-in to be validated up until 20min after it has been created.
- [x] It should only allow admins to validate a check-in.
- [x] It should only allow admins to register a gym.

## NFRs (Non-Functional Requirements)
- [x] It should encrypt the user password.
- [x] It should persist the data in a PostgresSQL database.
- [x] It should paginate all GET endpoints with 20 items per page.
- [x] It should identify a user based on a JWT (JSON Web Token).