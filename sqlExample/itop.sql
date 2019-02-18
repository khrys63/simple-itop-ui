-- SQL Dump :Example Database
-- Généré le :  lun. 18 fév. 2019 à 15:34

INSERT INTO `brand` (`id`) VALUES
(1),
(2),
(4);


INSERT INTO `connectableci` (`id`) VALUES
(8),
(9),
(10),
(11);


INSERT INTO `datacenterdevice` (`id`, `rack_id`, `enclosure_id`, `nb_u`, `managementip`, `powera_id`, `powerB_id`, `redundancy`) VALUES
(8, 2, 5, NULL, '', 0, 0, '1'),
(9, 2, 0, 1, '', 0, 0, '1'),
(10, 2, 0, 4, '', 0, 0, '1'),
(11, 2, 5, NULL, '', 0, 0, '1');


INSERT INTO `enclosure` (`id`, `rack_id`, `nb_u`) VALUES
(5, 2, 2),
(6, 2, 2);


INSERT INTO `functionalci` (`id`, `name`, `description`, `org_id`, `business_criticity`, `move2production`, `finalclass`, `obsolescence_date`) VALUES
(1, 'DCR1-R1', '', 1, 'low', NULL, 'Rack', NULL),
(2, 'DCR1-R2', '', 1, 'low', NULL, 'Rack', NULL),
(3, 'DCR1-R3', '', 1, 'low', NULL, 'Rack', NULL),
(4, 'DCR2-R1', '', 1, 'low', NULL, 'Rack', NULL),
(5, 'dcr1-r2-nuta-hyperviser1', 'U-006-007', 2, 'low', NULL, 'Enclosure', NULL),
(6, 'dcr1-r2-nuta-hyperviser2', 'U-008-009', 2, 'low', NULL, 'Enclosure', NULL),
(8, 'dcr1-hyper1-node-a', '', 2, 'low', NULL, 'Server', NULL),
(9, 'dcr1-r2-juni-sw-1', 'U-016 REAR', 2, 'low', NULL, 'NetworkDevice', NULL),
(10, 'dcr1-r2-netapp1', 'U-012-015', 2, 'low', NULL, 'StorageSystem', NULL),
(11, 'dcr1-hyper1-node-b', '', 2, 'low', NULL, 'Server', NULL);


INSERT INTO `location` (`id`, `name`, `status`, `org_id`, `address`, `postal_code`, `city`, `country`, `obsolescence_date`) VALUES
(1, 'DC-ROOM-1', 'active', 1, 'DataCenter 1', '', '', '', NULL),
(2, 'DC-ROOM-2', 'active', 1, 'DataCenter 2', '', '', '', NULL);


INSERT INTO `model` (`id`, `brand_id`, `type`) VALUES
(5, 4, 'StorageSystem'),
(6, 2, 'NetworkDevice'),
(7, 1, 'Enclosure');


INSERT INTO `networkdevice` (`id`, `networkdevicetype_id`, `iosversion_id`, `ram`) VALUES
(9, 3, 0, '');


INSERT INTO `networkdevicetype` (`id`) VALUES
(3);


INSERT INTO `organization` (`id`, `name`, `code`, `status`, `parent_id`, `parent_id_left`, `parent_id_right`, `deliverymodel_id`, `obsolescence_date`) VALUES
(1, 'My Company/Department', 'SOMECODE', 'active', 0, 1, 4, 0, NULL),
(2, 'IT Department', 'IT-DEP', 'active', 1, 2, 3, 0, NULL);


INSERT INTO `physicaldevice` (`id`, `serialnumber`, `location_id`, `status`, `brand_id`, `model_id`, `asset_number`, `purchase_date`, `end_of_warranty`) VALUES
(1, '', 1, 'production', 0, 0, '', NULL, NULL),
(2, '', 1, 'production', 0, 0, '', NULL, NULL),
(3, '', 1, 'production', 0, 0, '', NULL, NULL),
(4, '', 2, 'production', 0, 0, '', NULL, NULL),
(5, 'SN123654', 1, 'production', 1, 7, '', NULL, NULL),
(6, 'SN9654712', 1, 'production', 1, 7, '', NULL, NULL),
(8, '', 1, 'production', 1, 0, '', NULL, NULL),
(9, 'JU9876543', 1, 'production', 2, 6, '', NULL, NULL),
(10, 'NA6541321', 1, 'production', 4, 5, '', NULL, NULL),
(11, '', 1, 'production', 1, 0, '', NULL, NULL);


INSERT INTO `rack` (`id`, `nb_u`) VALUES
(1, 16),
(2, 16),
(3, 42),
(4, 42);


INSERT INTO `server` (`id`, `osfamily_id`, `osversion_id`, `oslicence_id`, `cpu`, `ram`) VALUES
(8, 0, 0, 0, '', ''),
(11, 0, 0, 0, '', '');


INSERT INTO `storagesystem` (`id`) VALUES
(10);


INSERT INTO `typology` (`id`, `name`, `finalclass`) VALUES
(1, 'Nutanix', 'Brand'),
(2, 'Juniper', 'Brand'),
(3, 'Switch', 'NetworkDeviceType'),
(4, 'NetAPP', 'Brand'),
(5, 'FAS 2554', 'Model'),
(6, 'EX4550', 'Model'),
(7, 'NX-1065 G4', 'Model');
