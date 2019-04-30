-- MySQL dump 10.13  Distrib 5.6.35, for macos10.12 (x86_64)
--
-- Host: localhost    Database: sema_core
-- ------------------------------------------------------
-- Server version	5.6.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(255) NOT NULL COMMENT 'Contact Name.',
  `gender` varchar(255) DEFAULT NULL COMMENT 'Contact gender.',
  `phone_number1` varchar(255) NOT NULL COMMENT 'Required phone number.',
  `phone_number2` varchar(255) DEFAULT NULL COMMENT 'Additional optional phone number.',
  `notes` varchar(255) DEFAULT NULL COMMENT 'Additional notes about the customer.',
  `multimedia1` longtext COMMENT 'Reference to photo, file, etc. related to the contact.',
  `multimedia2` longtext COMMENT 'Additional reference to photo, file, etc. related to the contact.',
  `unique_identifier` varchar(255) DEFAULT NULL COMMENT 'A numerical or alphanumerical code that uniquely identifies the contact.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_identifier_UNIQUE` (`unique_identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(100) NOT NULL COMMENT 'Name of country.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_account`
--

DROP TABLE IF EXISTS `customer_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_account` (
  `id` varchar(255) NOT NULL COMMENT 'Uses an application generated UUID.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(255) NOT NULL COMMENT 'Name of business, person, or entity.',
  `customer_type_id` bigint(20) NOT NULL COMMENT 'Customer type reference.',
  `sales_channel_id` bigint(20) NOT NULL COMMENT 'Sales channel reference.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `due_amount` decimal(19,2) DEFAULT NULL COMMENT 'Total amount due.',
  `consumer_base` int(11) DEFAULT NULL COMMENT 'BIGINT Manually entered value on number of people they serve. For example, a school may have 1,000 meaning 1,000 students, a family may have 5, and a reseller may have 500.  In the case of the reseller, this calculation can be used to calculate penetration rate. In the case of schools, the number of students served.',
  `address_line1` varchar(255) NOT NULL COMMENT 'Required business address.',
  `address_line2` varchar(255) DEFAULT NULL COMMENT 'Optional business address.',
  `address_line3` varchar(255) DEFAULT NULL COMMENT 'Optional business address.',
  `gps_coordinates` varchar(255) DEFAULT NULL,
  `what3words` varchar(255) DEFAULT NULL COMMENT 'Alternative coordinate system.',
  `phone_number` varchar(255) NOT NULL COMMENT 'Main contact phone (may be same as contact phone).',
  `notes` varchar(255) DEFAULT NULL COMMENT 'Additional notes about the customer.',
  `multimedia1` longtext COMMENT 'Reference to photo, file, etc. related to the customer.',
  `multimedia2` longtext COMMENT 'Additional reference to photo, file, etc. related to the customer.',
  `multimedia3` longtext COMMENT 'Additional reference to photo, file, etc. related to the customer.',
  `multimedia4` longtext COMMENT 'Additional reference to photo, file, etc. related to the customer.',
  `income_level` decimal(19,2) DEFAULT NULL COMMENT 'Estimated daily income as captured during customer registration.',
  `gender` varchar(255) DEFAULT NULL COMMENT 'Optional account property. (Useful when there are no other contacts associated with the customer account)',
  `distance` int(11) DEFAULT NULL COMMENT 'Distance from the kiosk. (This is used in demographics to group customers by distance from the kiosk)',
  PRIMARY KEY (`id`),
  KEY `customer_account_sales_channel_id_fk_idx` (`sales_channel_id`),
  KEY `customer_account_kiosk_id_fk_idx` (`kiosk_id`),
  KEY `customer_account_customer_type_id_fk_idx` (`customer_type_id`),
  CONSTRAINT `customer_account_customer_type_id_fk` FOREIGN KEY (`customer_type_id`) REFERENCES `customer_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `customer_account_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `customer_account_sales_channel_id_fk` FOREIGN KEY (`sales_channel_id`) REFERENCES `sales_channel` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_account_contact`
--

DROP TABLE IF EXISTS `customer_account_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_account_contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `customer_account_id` varchar(255) NOT NULL COMMENT 'Customer account reference.',
  `contact_id` bigint(20) NOT NULL COMMENT 'Contact reference.',
  PRIMARY KEY (`id`),
  KEY `customer_account_contact_contact_id_fk_idx` (`contact_id`),
  KEY `customer_account_contact_customer_account_id_fk_idx` (`customer_account_id`),
  CONSTRAINT `customer_account_contact_contact_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `customer_account_contact_customer_account_id_fk` FOREIGN KEY (`customer_account_id`) REFERENCES `customer_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Customer to contact mapping table.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_account_sponsor`
--

DROP TABLE IF EXISTS `customer_account_sponsor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_account_sponsor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_account_id` varchar(255) NOT NULL COMMENT 'Customer account reference.',
  `sponsor_id` varchar(255) NOT NULL COMMENT 'Sponsor reference.',
  PRIMARY KEY (`id`),
  KEY `customer_account_sponsor_customer_account_id_fk_idx` (`customer_account_id`),
  KEY `customer_account_sponsor_sponsor_id_fk_idx` (`sponsor_id`),
  CONSTRAINT `customer_account_sponsor_customer_account_id_fk` FOREIGN KEY (`customer_account_id`) REFERENCES `customer_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `customer_account_sponsor_sponsor_id_fk` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps sponsor to a specific customer account.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `customer_details`
--

DROP TABLE IF EXISTS `customer_details`;
/*!50001 DROP VIEW IF EXISTS `customer_details`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `customer_details` AS SELECT 
 1 AS `active`,
 1 AS `created_at`,
 1 AS `customer_name`,
 1 AS `income_level`,
 1 AS `gender`,
 1 AS `distance`,
 1 AS `customer_consumer_base`,
 1 AS `kiosk_name`,
 1 AS `kiosk_id`,
 1 AS `kiosk_consumer_base`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `customer_type`
--

DROP TABLE IF EXISTS `customer_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `description` varchar(255) DEFAULT NULL COMMENT 'Type description.',
  `name` varchar(255) NOT NULL COMMENT 'Type name.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL COMMENT 'Date of delivery.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `user_id` bigint(20) NOT NULL COMMENT 'Driver reference.',
  `depart_kiosk` time DEFAULT NULL COMMENT 'Time when the driver left the kiosk.',
  `return_kiosk` time DEFAULT NULL COMMENT 'Time when the driver got back to the kiosk.',
  `vehicle_id` bigint(20) DEFAULT NULL COMMENT 'Vehicle reference.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data/Time when updated.',
  PRIMARY KEY (`id`),
  KEY `delivery_kiosk_id_fk_idx` (`kiosk_id`) USING BTREE,
  KEY `delivery_vehicle_id_fk_idx` (`vehicle_id`) USING BTREE,
  KEY `delivery_user_id_fk_idx` (`user_id`),
  CONSTRAINT `delivery_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`),
  CONSTRAINT `delivery_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `delivery_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Manages delivery trips.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_leg`
--

DROP TABLE IF EXISTS `delivery_leg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_leg` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_id` bigint(20) NOT NULL COMMENT 'Delivery reference.',
  `customer_account_id` varchar(255) NOT NULL COMMENT 'Customer account reference.',
  `empty_pickup_id` bigint(20) NOT NULL COMMENT 'Empty pickup reference.',
  `arrive_at_customer` time DEFAULT NULL COMMENT 'Time the driver got to the customer.',
  `depart_from_customer` time DEFAULT NULL COMMENT 'Time the driver left the customer.',
  `comment` varchar(255) DEFAULT NULL COMMENT 'Comment made by the driver about this delivery leg.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  PRIMARY KEY (`id`),
  KEY `delivery_leg_delivery_id_fk_idx` (`delivery_id`) USING BTREE,
  KEY `delivery_leg_empty_pickup_id_fk_idx` (`empty_pickup_id`),
  KEY `delivery_leg_customer_account_id_fk_idx` (`customer_account_id`),
  CONSTRAINT `delivery_leg_customer_account_id_fk` FOREIGN KEY (`customer_account_id`) REFERENCES `customer_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `delivery_leg_delivery_id_fk` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`),
  CONSTRAINT `delivery_leg_empty_pickup_id_fk` FOREIGN KEY (`empty_pickup_id`) REFERENCES `empty_pickup` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Manages individual leg of each delivery.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_leg_receipt`
--

DROP TABLE IF EXISTS `delivery_leg_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_leg_receipt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_leg_id` bigint(20) NOT NULL COMMENT 'Delivery leg reference.',
  `receipt_id` varchar(255) NOT NULL COMMENT 'Receipt reference.',
  PRIMARY KEY (`id`),
  KEY `delivery_leg_receipt_delivery_leg_id_fk_idx` (`delivery_leg_id`),
  KEY `delivery_leg_receipt_receipt_id_fk_idx` (`receipt_id`),
  CONSTRAINT `delivery_leg_receipt_delivery_leg_id_fk` FOREIGN KEY (`delivery_leg_id`) REFERENCES `delivery_leg` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `delivery_leg_receipt_receipt_id_fk` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps a delivery leg to a receipt.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'The name of the device as manufactured.',
  `serial_number` varchar(255) NOT NULL COMMENT 'The serial number of the device.',
  `ip_address` varchar(255) NOT NULL COMMENT 'The IP address of the device.',
  `firmware` varchar(255) NOT NULL COMMENT 'The firmware being used by the device.',
  `kiosk_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `device_kiosk_id_fk_idx` (`kiosk_id`),
  CONSTRAINT `device_kiosk_id_fk` FOREIGN KEY (`id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Stores information about devices for automated readings on water operations and quality.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empty_pickup`
--

DROP TABLE IF EXISTS `empty_pickup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empty_pickup` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `product_id` bigint(20) NOT NULL COMMENT 'Product reference.',
  `quantity` varchar(45) DEFAULT NULL COMMENT 'Number of empties picked up (jugs, canisters).',
  PRIMARY KEY (`id`),
  KEY `empty_pickup_product_id_fk_idx` (`product_id`),
  CONSTRAINT `empty_pickup_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tracks pickups of empty containers (reusable jugs, bags, canisters, etc.).';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kiosk`
--

DROP TABLE IF EXISTS `kiosk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kiosk` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(150) NOT NULL COMMENT 'Name of kiosk.',
  `region_id` bigint(20) NOT NULL COMMENT 'Kiosk region reference.',
  `consumer_base` int(11) DEFAULT NULL COMMENT 'BIGINT Manually entered value on number of ‘customers’ potentially served by the kiosk. (For example a kiosk could server a geographic area that has 1000 households with an average household population to 2.5 resulting in a consumer base of 2500',
  `gps_coordinates` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kiosk_region_id_fk_idx` (`region_id`),
  CONSTRAINT `kiosk_region_id_fk` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kiosk_parameter`
--

DROP TABLE IF EXISTS `kiosk_parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kiosk_parameter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `parameter_id` bigint(20) NOT NULL COMMENT 'Parameter reference.',
  `sampling_site_id` bigint(20) NOT NULL COMMENT 'Sampling site reference.',
  PRIMARY KEY (`id`),
  KEY `kiosk_parameter_kiosk_id_fk_idx` (`kiosk_id`),
  KEY `kiosk_parameter_parameter_id_fk_idx` (`parameter_id`),
  KEY `kiosk_parameter_sampling_site_id_fk_idx` (`sampling_site_id`),
  CONSTRAINT `kiosk_parameter_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `kiosk_parameter_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `kiosk_parameter_sampling_site_id_fk` FOREIGN KEY (`sampling_site_id`) REFERENCES `sampling_site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps water quality parameters and sampling sites to kiosks.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `measurement`
--

DROP TABLE IF EXISTS `measurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measurement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parameter_id` bigint(20) NOT NULL COMMENT 'Parameter reference.',
  `value` decimal(19,2) NOT NULL COMMENT 'Measurement value.',
  `reading_id` bigint(20) NOT NULL COMMENT 'Reading reference.',
  PRIMARY KEY (`id`),
  KEY `measurement_parameter_id_fk_idx` (`parameter_id`) USING BTREE,
  KEY `measurement_reading_id_fk_idx` (`reading_id`),
  CONSTRAINT `measurement_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`),
  CONSTRAINT `measurement_reading_id_fk` FOREIGN KEY (`reading_id`) REFERENCES `reading` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Records measurements using reading and parameter.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parameter`
--

DROP TABLE IF EXISTS `parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parameter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `is_ok_not_ok` bit(1) NOT NULL COMMENT '1 makes it a Yes or No radial choice; 0 makes it a decimal value.',
  `is_used_in_totalizer` bit(1) NOT NULL COMMENT 'Used in determining the totalizer line on the volumeByDay web report.',
  `manual` bit(1) NOT NULL COMMENT '1 to show up on kiosk tablet for manual entry; 0 for parameters measured by things like solar sensors.',
  `maximum` decimal(19,2) DEFAULT NULL COMMENT 'Minimum and maximum validates the input result on the kiosk displayed as the range of valid values.',
  `minimum` decimal(19,2) DEFAULT NULL COMMENT 'Minimum and maximum validates the input result on the kiosk displayed as the range of valid values.',
  `name` varchar(255) NOT NULL COMMENT 'Parameter name.',
  `priority` int(11) DEFAULT NULL COMMENT 'Order in which entry fields are displayed.',
  `unit` varchar(255) DEFAULT NULL COMMENT 'Measurement unit such as mg/L CaCO3 (ppm).',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `parameter_name_uq` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display on UI, 0 to hide.',
  `name` varchar(255) NOT NULL COMMENT 'Name of product.',
  `sku` varchar(255) NOT NULL COMMENT 'External SKU identifier.',
  `description` varchar(255) NOT NULL COMMENT 'Product description.',
  `category_id` bigint(20) NOT NULL COMMENT 'Product category reference.',
  `price_amount` decimal(19,2) NOT NULL COMMENT 'Price per unit.',
  `price_currency` varchar(255) NOT NULL COMMENT 'Currency used.',
  `minimum_quantity` int(11) DEFAULT NULL COMMENT 'Specifying min max will pop up the quantity spinner in UI.',
  `maximum_quantity` int(11) DEFAULT NULL COMMENT 'Specifying min max will pop up the quantity spinner in UI.',
  `unit_per_product` float NOT NULL COMMENT 'If a water product, volume of water measured in order to measure water volume (e.g 5 gallons per SKU).  If non water product, measures quantity in each unit sold (one bag of milk has 25 kg).',
  `unit_measure` varchar(255) NOT NULL COMMENT 'Unit of measurement (liters, gallons, ounce, grams, etc.).',
  `cogs_amount` decimal(19,2) NOT NULL COMMENT 'Cost of product per SKU for gross margin calculation purposes.',
  `base64encoded_image` longtext NOT NULL COMMENT 'Reference to product picture. Must be a 144x144 PNG.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_sku_uq` (`sku`),
  KEY `product_category_id_fk_idx` (`category_id`),
  CONSTRAINT `product_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `description` varchar(255) DEFAULT NULL COMMENT 'Longer description.',
  `name` varchar(255) NOT NULL COMMENT 'Category Name.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_mrp`
--

DROP TABLE IF EXISTS `product_mrp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_mrp` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `product_id` bigint(20) NOT NULL COMMENT 'Product reference.',
  `sales_channel_id` bigint(20) NOT NULL COMMENT 'Sales channel reference.',
  `price_amount` decimal(19,2) NOT NULL COMMENT 'Price for that product for specific kiosk/channel combo.',
  `price_currency` varchar(255) NOT NULL COMMENT 'Currency used for price.',
  `cogs_amount` decimal(19,2) NOT NULL COMMENT 'Cost of product for gross margin calculation purposes.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  PRIMARY KEY (`id`),
  KEY `product_mrp_kiosk_id_fk_idx` (`kiosk_id`),
  KEY `product_mrp_product_id_fk_idx` (`product_id`),
  KEY `product_mrp_sales_channel_id_fk_idx` (`sales_channel_id`),
  CONSTRAINT `product_mrp_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `product_mrp_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `product_mrp_sales_channel_id_fk` FOREIGN KEY (`sales_channel_id`) REFERENCES `sales_channel` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps product pricing to sales channels & kiosks. Each product+kiosk+channel can have different prices.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `amount` decimal(19,2) NOT NULL COMMENT 'Discount amount: If type = AMOUNT.  Uses same currency units as product price set in product table.  If type = PERCENT, then percentage off of list price.',
  `applies_to` varchar(255) NOT NULL COMMENT 'Must either be ''SKU'' or ''BASKET'' of goods.',
  `base64encoded_image` longtext COMMENT 'Reference to promotion picture.',
  `start_date` datetime NOT NULL COMMENT 'Dtae and time of when promotion starts.',
  `end_date` datetime NOT NULL COMMENT 'Dtae and time of when promotion ends.',
  `product_id` bigint(20) NOT NULL COMMENT 'Product reference.',
  `sku` varchar(255) NOT NULL COMMENT 'Promotion SKU',
  `type` varchar(255) NOT NULL COMMENT 'PERCENT (e.g. 10 for 10% off) or AMOUNT Value (e.g. 10 currency units off)',
  PRIMARY KEY (`id`),
  KEY `promotion_product_id_fk_idx` (`product_id`),
  CONSTRAINT `promotion_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reading`
--

DROP TABLE IF EXISTS `reading`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reading` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `parameter_id` bigint(20) NOT NULL COMMENT 'Parameter reference.',
  `sampling_site_id` bigint(20) NOT NULL COMMENT 'Sampling site reference.',
  `value` decimal(19,2) NOT NULL COMMENT 'The reading value',
  `user_id` bigint(20) NOT NULL COMMENT 'User reference.',
  PRIMARY KEY (`id`),
  KEY `reading_kiosk_id_fk_idx` (`kiosk_id`),
  KEY `reading_parameter_id_fk_idx` (`parameter_id`),
  KEY `reading_sampling_site_id_fk_idx` (`sampling_site_id`),
  KEY `reading_user_id_fk_idx` (`user_id`),
  CONSTRAINT `reading_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `reading_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `reading_sampling_site_id_fk` FOREIGN KEY (`sampling_site_id`) REFERENCES `sampling_site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `reading_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps sampling site to specific user of employee at site. Measurement table uses user from this table to record who made the measurement for each reading .';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rebate`
--

DROP TABLE IF EXISTS `rebate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rebate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_account_id` varchar(255) NOT NULL COMMENT 'Customer account reference.',
  `type` varchar(255) NOT NULL COMMENT 'PERCENT (e.g. 10% rebate) or AMOUNT (e.g. 1 currency unit for each SKU sold).',
  `rate` decimal(19,2) NOT NULL COMMENT 'Either decimal or integer based on rebate type.',
  PRIMARY KEY (`id`),
  KEY `rebate_customer_account_id_fk_idx` (`customer_account_id`),
  CONSTRAINT `rebate_customer_account_id_fk` FOREIGN KEY (`customer_account_id`) REFERENCES `customer_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps rebate rate to specific customer_id’s to calculate product rebate due to each customer. Version below replaces table structure in original dlo schema.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt` (
  `id` varchar(255) NOT NULL COMMENT 'Client generated unique ID in format: [updated_at]+[sequence]  2018072700001. Will be used for reference outside of application such as receipt number printed on paper receipts.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `currency_code` varchar(255) NOT NULL COMMENT 'Currency used.',
  `customer_account_id` varchar(255) NOT NULL COMMENT 'Customer account reference.',
  `amount_cash` decimal(19,2) DEFAULT NULL COMMENT 'Amount paid by cash.',
  `amount_mobile` decimal(19,2) DEFAULT NULL COMMENT 'Amount paid by mobile or other method.',
  `amount_loan` decimal(19,2) DEFAULT NULL COMMENT 'Amount covered by loan.',
  `amount_card` decimal(19,2) DEFAULT NULL COMMENT 'Amount covered by card.',
  `delivery_id` bigint(20) DEFAULT NULL COMMENT 'Delivery reference.',
  `is_sponsor_selected` bit(1) NOT NULL DEFAULT b'0' COMMENT '1 for sponsor selected, 0 otherwise.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `user_id` bigint(20) DEFAULT NULL COMMENT 'The user/kiosk staff who entered the sale.',
  `payment_type` varchar(255) NOT NULL,
  `sales_channel_id` bigint(20) NOT NULL COMMENT 'Sales channel reference.',
  `customer_type_id` bigint(20) NOT NULL COMMENT 'Customer type reference.',
  `sponsor_id` varchar(255) DEFAULT NULL COMMENT 'Sponsor reference.',
  `sponsor_amount` decimal(19,2) NOT NULL DEFAULT '0.00' COMMENT 'Amount paid by sponsor.',
  `total` decimal(19,2) NOT NULL COMMENT 'Total amount in currency.',
  `cogs` varchar(45) NOT NULL COMMENT 'Cost of goods sold. Net revenue for this receipt is total-cogs',
  `uuid` varchar(255) NOT NULL COMMENT 'For integration with other applications such as a receipt printer over Bluetooth connection.',
  `active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `receipt_kiosk_id_fk_idx` (`kiosk_id`),
  KEY `receipt_sales_channel_id_fk_idx` (`sales_channel_id`),
  KEY `receipt_customer_type_id_fk_idx` (`customer_type_id`),
  KEY `receipt_customer_account_id_fk_idx` (`customer_account_id`),
  KEY `receipt_sponsor_id_fk_idx` (`sponsor_id`),
  KEY `receipt_user_id_fk_idx` (`user_id`),
  CONSTRAINT `receipt_customer_account_id_fk` FOREIGN KEY (`customer_account_id`) REFERENCES `customer_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_customer_type_id_fk` FOREIGN KEY (`customer_type_id`) REFERENCES `customer_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_sales_channel_id_fk` FOREIGN KEY (`sales_channel_id`) REFERENCES `sales_channel` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_sponsor_id_fk` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `receipt_details`
--

DROP TABLE IF EXISTS `receipt_details`;
/*!50001 DROP VIEW IF EXISTS `receipt_details`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `receipt_details` AS SELECT 
 1 AS `created_at`,
 1 AS `quantity`,
 1 AS `product_id`,
 1 AS `receipt_id`,
 1 AS `sales_channel_id`,
 1 AS `kiosk_id`,
 1 AS `amount_cash`,
 1 AS `amount_loan`,
 1 AS `amount_mobile`,
 1 AS `amount_card`,
 1 AS `customer_account_id`,
 1 AS `unit_per_product`,
 1 AS `volume`,
 1 AS `total`,
 1 AS `name`,
 1 AS `income_level`,
 1 AS `customer_type_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `receipt_line_item`
--

DROP TABLE IF EXISTS `receipt_line_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt_line_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `currency_code` varchar(255) NOT NULL COMMENT 'Currency used.',
  `price_total` decimal(19,2) NOT NULL COMMENT 'This is price total, so price per item is price/quantity',
  `quantity` varchar(45) NOT NULL COMMENT 'Total number of product of that SKU.  If you have 5 jugs of water, quantity = 5. If you purchase 3 bags of milk, quantity = 3.	',
  `receipt_id` varchar(255) NOT NULL COMMENT 'Receipt reference.',
  `product_id` bigint(20) NOT NULL COMMENT 'Product reference.',
  `cogs_total` decimal(19,2) NOT NULL,
  `active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `receipt_line_item_receipt_id_fk_idx` (`receipt_id`),
  KEY `receipt_line_item_product_id_fk_idx` (`product_id`),
  CONSTRAINT `receipt_line_item_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `receipt_line_item_receipt_id_fk` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(150) NOT NULL COMMENT 'Region Name.',
  `description` varchar(250) NOT NULL COMMENT 'Descriptive name of region.',
  `country_id` bigint(20) unsigned NOT NULL COMMENT 'Region country reference.',
  PRIMARY KEY (`id`),
  KEY `region_country_id_fk_idx` (`country_id`),
  CONSTRAINT `region_country_id_fk` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `region_promotion`
--

DROP TABLE IF EXISTS `region_promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region_promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `promotion_id` bigint(20) NOT NULL COMMENT 'Promotion reference.',
  `region_id` bigint(20) NOT NULL COMMENT 'Region reference.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  PRIMARY KEY (`id`),
  KEY `region_promotion_promotion_id_fk_idx` (`promotion_id`) USING BTREE,
  KEY `region_promotion_region_id_fk_idx` (`region_id`) USING BTREE,
  KEY `region_promotion_kiosk_id_fk_idx` (`kiosk_id`) USING BTREE,
  CONSTRAINT `region_promotion_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`),
  CONSTRAINT `region_promotion_promotion_id_fk` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
  CONSTRAINT `region_promotion_region_id_fk` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps each promotion to each region turning it off or on for each region.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `region_rebate`
--

DROP TABLE IF EXISTS `region_rebate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region_rebate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `region_id` bigint(20) NOT NULL COMMENT 'Region reference.',
  `rebate_id` bigint(20) NOT NULL COMMENT 'Rebate reference.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  PRIMARY KEY (`id`),
  KEY `region_rebate_region_id_fk_idx` (`region_id`) USING BTREE,
  KEY `region_rebate_rebate_id_fk_idx` (`rebate_id`) USING BTREE,
  KEY `region_rebate_kiosk_id_fk_idx` (`kiosk_id`) USING BTREE,
  CONSTRAINT `region_rebate_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`),
  CONSTRAINT `region_rebate_rebate_id_fk` FOREIGN KEY (`rebate_id`) REFERENCES `rebate` (`id`),
  CONSTRAINT `region_rebate_region_id_fk` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `authority` varchar(255) NOT NULL COMMENT 'Role name.',
  `code` varchar(255) NOT NULL COMMENT 'Role code.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_authority_uq` (`authority`),
  UNIQUE KEY `role_code_uq` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sales_channel`
--

DROP TABLE IF EXISTS `sales_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_channel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display on UI, 0 to hide.',
  `name` varchar(255) NOT NULL COMMENT 'Sales channel name.',
  `description` varchar(45) DEFAULT NULL COMMENT 'Sales channel description.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sampling_site`
--

DROP TABLE IF EXISTS `sampling_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sampling_site` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `is_used_for_totalizer` bit(1) NOT NULL COMMENT 'Used in  ''Gallons distributed'' calculation on web report; only sites with ''true'' are used in calculation, totalizer calculation requires us to subtract PM sample sites numbers from AM Sample sites in webpage.',
  `name` varchar(255) NOT NULL COMMENT 'Descriptive name of where the sample is taken.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `followup_to_site_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sampling_site_followup_to_site_id_fk_idx` (`followup_to_site_id`),
  CONSTRAINT `sampling_site_followup_to_site_id_fk` FOREIGN KEY (`followup_to_site_id`) REFERENCES `sampling_site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sensor`
--

DROP TABLE IF EXISTS `sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'The name of the sensor, as manufactured.',
  `sampling_site_id` bigint(20) NOT NULL COMMENT 'The sampling site at which this sensor is sending data from.',
  `parameter_id` bigint(20) NOT NULL COMMENT 'The parameter this sensor is sending data for.',
  `device_id` bigint(20) NOT NULL COMMENT 'The device this sensor is attached to.',
  PRIMARY KEY (`id`),
  KEY `sensor_sampling_site_id_fk_idx` (`sampling_site_id`),
  KEY `sensor_parameter_id_fk_idx` (`parameter_id`),
  KEY `sensor_device_id_fk_idx` (`device_id`),
  CONSTRAINT `sensor_device_id_fk` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sensor_parameter_id_fk` FOREIGN KEY (`parameter_id`) REFERENCES `parameter` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sensor_sampling_site_id_fk` FOREIGN KEY (`sampling_site_id`) REFERENCES `sampling_site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Stores information about sensors for automated readings on water operations and/or quality.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sponsor`
--

DROP TABLE IF EXISTS `sponsor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsor` (
  `id` varchar(255) NOT NULL COMMENT 'Auto-generated uuid.  Used by contact to link contact to sponsor.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `name` varchar(255) NOT NULL COMMENT 'Sponsor name.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `phone_number` varchar(255) DEFAULT NULL COMMENT 'Main phone number of sponsor (contacts associated with Sponsor may also have phone numbers and other contact info).',
  PRIMARY KEY (`id`),
  KEY `sponsor_kiosk_id_fk_idx` (`kiosk_id`),
  CONSTRAINT `sponsor_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Manages list of sponsors.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sponsor_contact`
--

DROP TABLE IF EXISTS `sponsor_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsor_contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sponsor_id` varchar(255) NOT NULL COMMENT 'Sponsor reference.',
  `contact_id` bigint(20) NOT NULL COMMENT 'Contact reference.',
  PRIMARY KEY (`id`),
  KEY `sponsor_contact_contact_id_fk_idx` (`contact_id`) USING BTREE,
  KEY `sponsor_contact_sponsor_id_fk_idx` (`sponsor_id`),
  CONSTRAINT `sponsor_contact_contact_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`),
  CONSTRAINT `sponsor_contact_sponsor_id_fk` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Sponsor to contact mapping table.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT 'Username of the user.',
  `email` varchar(255) NOT NULL COMMENT 'Email of the user.',
  `password` varchar(255) NOT NULL COMMENT 'Password of the user.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `first_name` varchar(255) NOT NULL COMMENT 'First name of user.',
  `last_name` varchar(255) NOT NULL COMMENT 'Last name of user.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_uq` (`email`),
  UNIQUE KEY `user_username_uq` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_contact`
--

DROP TABLE IF EXISTS `user_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `contact_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_contact_contact_id_fk_idx` (`contact_id`),
  KEY `user_contact_user_id_fk_idx` (`user_id`),
  CONSTRAINT `user_contact_contact_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_contact_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `role_id` bigint(20) NOT NULL COMMENT 'Role reference.',
  `user_id` bigint(20) NOT NULL COMMENT 'User reference.',
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `user_role_role_id_fk` (`role_id`),
  KEY `user_role_user_id_fk_idx` (`user_id`),
  CONSTRAINT `user_role_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `user_role_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Maps a user to a role.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/Time when created.',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date/Time when updated.',
  `active` bit(1) NOT NULL DEFAULT b'1' COMMENT '1 to display item on UI, 0 to hide.',
  `kiosk_id` bigint(20) NOT NULL COMMENT 'Kiosk reference.',
  `name` varchar(255) NOT NULL COMMENT 'Vehicle name.',
  `license` varchar(255) NOT NULL COMMENT 'Vehicle license.',
  `type` varchar(255) NOT NULL COMMENT 'Vehicle type.',
  PRIMARY KEY (`id`),
  KEY `vehicle_kiosk_id_fk_idx` (`kiosk_id`),
  CONSTRAINT `vehicle_kiosk_id_fk` FOREIGN KEY (`kiosk_id`) REFERENCES `kiosk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='List of vehicles.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `customer_details`
--

/*!50001 DROP VIEW IF EXISTS `customer_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`::1` SQL SECURITY DEFINER */
/*!50001 VIEW `customer_details` AS select `customer_account`.`active` AS `active`,`customer_account`.`created_at` AS `created_at`,`customer_account`.`name` AS `customer_name`,`customer_account`.`income_level` AS `income_level`,`customer_account`.`gender` AS `gender`,`customer_account`.`distance` AS `distance`,`customer_account`.`consumer_base` AS `customer_consumer_base`,`kiosk`.`name` AS `kiosk_name`,`kiosk`.`id` AS `kiosk_id`,`kiosk`.`consumer_base` AS `kiosk_consumer_base` from (`customer_account` join `kiosk` on((`customer_account`.`kiosk_id` = `kiosk`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `receipt_details`
--

/*!50001 DROP VIEW IF EXISTS `receipt_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`::1` SQL SECURITY DEFINER */
/*!50001 VIEW `receipt_details` AS select `receipt_line_item`.`created_at` AS `created_at`,`receipt_line_item`.`quantity` AS `quantity`,`receipt_line_item`.`product_id` AS `product_id`,`receipt_line_item`.`receipt_id` AS `receipt_id`,`receipt`.`sales_channel_id` AS `sales_channel_id`,`receipt`.`kiosk_id` AS `kiosk_id`,`receipt`.`amount_cash` AS `amount_cash`,`receipt`.`amount_loan` AS `amount_loan`,`receipt`.`amount_mobile` AS `amount_mobile`,`receipt`.`amount_card` AS `amount_card`,`receipt`.`customer_account_id` AS `customer_account_id`,`product`.`unit_per_product` AS `unit_per_product`,(`receipt_line_item`.`quantity` * `product`.`unit_per_product`) AS `volume`,`receipt`.`total` AS `total`,`customer_account`.`name` AS `name`,`customer_account`.`income_level` AS `income_level`,`customer_account`.`customer_type_id` AS `customer_type_id` from (((`receipt_line_item` join `receipt` on((`receipt_line_item`.`receipt_id` = `receipt`.`id`))) join `product` on((`receipt_line_item`.`product_id` = `product`.`id`))) join `customer_account` on((`receipt`.`customer_account_id` = `customer_account`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-16 22:10:00
