Batch Upload CSV Layout
=======================

**Service_ServiceCodeID**:
 - Computer Lab           688
 - Laundry                689
 - Shower                 780
 - Voucher TS             694
 - DI Voucher             861
 - Donations Closet       861
 - Emergency Funds        543
 - Food                   554
 - Hot Meals              484
 - Pet Supplies           718
 - Sack Meals             485
 - Case Management        702
 - CoC Case Management    747
 - Crisis Management      532

**Service_ClientID**:
 HMIS Client #

**Service_EnrollID**:
 Enrollment # in HMIS for the client.

**Service_RegionID**:
 (Always blank)

**Service_BeginDate**:
 Format is MM/DD/YYYY (no leading zeros. ex: 5/24/2022)

**Service_EndDate**:
 Format is MM/DD/YYYY (no leading zeros. ex: 5/24/2022)

**Service_UnitsOfMeasure**:
 - D  Dollars
 - M  Minutes
 - C  Count (this is the default and most common)
 - H  Hours

Service_Units:
 Typically 1 for unit of measurement C (count)

**Service_UnitValue**:
 (Should be 0 except for Dollars type)

**Service_UserID**:
 User Id as assigned in HMIS (mine is BS7)

**Service_CreatedDate**:
 Format is MM/DD/YYYY (no leading zeros. ex: 5/24/2022)

**Service_CreatedBy**:
 User Id as assigned in HMIS

**Service_UpdatedDate**:
 Format is MM/DD/YYYY (no leading zeros. ex: 5/24/2022)

**Service_UpdatedBy**:
 User Id as assigned in HMIS

**Service_OrgID**:
 STG

**Service_RestrictOrg**:
 Restrict to MOU/Info Release

Sample table:

|Service_ServiceCodeID|Service_ClientID|Service_EnrollID|Service_RegionID|Service_BeginDate|Service_EndDate|Service_UnitsOfMeasure|Service_Units|Service_UnitValue|Service_UserID|Service_CreatedDate|Service_CreatedBy|Service_UpdatedDate|Service_UpdatedBy|Service_OrgID| Service_RestrictOrg          |
|---------------------|----------------|----------------|----------------|-----------------|---------------|----------------------|-------------|-----------------|--------------|-------------------|-----------------|-------------------|-----------------|-------------|------------------------------|
|629|419490|106136| |5/24/2022|5/24/2022|C|1|0|BS7|5/24/2022|BS7|5/24/2022|BS7|STG|Restrict to MOU/Info Release |
|629|408213|93801| |5/24/2022|5/24/2022|C|1|0|BS7|5/24/2022|BS7|5/24/2022|BS7|STG|Restrict to MOU/Info Release |
|629|410681|94419| |5/24/2022|5/24/2022|C|1|0|BS7|5/24/2022|BS7|5/24/2022|BS7|STG|Restrict to MOU/Info Release|
