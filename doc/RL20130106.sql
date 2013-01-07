-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 06, 2013 at 08:37 AM
-- Server version: 5.5.28
-- PHP Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `relations`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `street_number` int(11) DEFAULT NULL,
  `street_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `zip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `street_number` (`street_number`),
  KEY `street_name` (`street_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `created_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `parent` (`parent_name`,`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `controls`
--

CREATE TABLE IF NOT EXISTS `controls` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `company_id` bigint(20) unsigned DEFAULT NULL,
  `control_set` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'Root',
  `sequence` int(11) DEFAULT '0',
  `control_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `control_value` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `company` (`company_id`),
  KEY `sequence` (`control_set`,`sequence`),
  KEY `name` (`control_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000248 ;

--
-- Dumping data for table `controls`
--

INSERT INTO `controls` (`id`, `created_by`, `created_at`, `updated_by`, `updated_at`, `status`, `company_id`, `control_set`, `sequence`, `control_name`, `control_value`) VALUES
(1000000008, 1000000001, '2011-05-09 19:51:49', 1000000001, '2012-08-13 11:07:15', 'active', 1000000001, 'System Keys', 50, 'SMTP', ''),
(1000000002, NULL, NULL, 1000000001, '2011-05-09 20:17:27', 'active', 1000000001, 'Root', 0, 'Status Codes', ''),
(1000000003, NULL, NULL, 1000000001, '2011-05-09 20:06:10', 'active', 1000000001, 'Root', 0, 'System Defaults', ''),
(1000000004, NULL, NULL, 1000000001, '2011-05-09 20:17:29', 'active', 1000000001, 'Root', 0, 'System Keys', ''),
(1000000005, NULL, NULL, 1000000001, '2011-09-14 09:12:46', 'active', 1000000001, 'System Keys', 100, 'Time Zone', 'America/Los_Angeles'),
(1000000006, NULL, NULL, 1000000001, '2011-05-14 20:33:09', 'active', 1000000001, 'System Keys', 110, 'Email Status', 'stopped at 2010-12-24 19:47:05'),
(1000000007, NULL, NULL, 1000000001, '2011-05-09 20:17:44', 'active', 1000000001, 'System Keys', 400, 'Upload Max File Size', '30M'),
(1000000009, 1000000001, '2011-05-09 20:02:51', 1000000001, '2012-02-10 07:53:26', 'active', 1000000001, 'System Keys', 200, 'Email From System', 'noreply;noreply@jkysoftware.com'),
(1000000010, 1000000001, '2011-05-09 20:05:41', 1000000001, '2011-05-09 20:17:24', 'active', 1000000001, 'Root', 0, 'Root', ''),
(1000000012, 1000000001, '2011-05-12 18:01:11', 1000000001, '2011-09-14 08:40:22', 'active', 1000000001, 'Status Codes', 0, 'active', ''),
(1000000013, 1000000001, '2011-05-12 18:01:25', 1000000001, '2011-09-14 08:40:26', 'active', 1000000001, 'Status Codes', 0, 'inactive', ''),
(1000000020, 1000000001, '2011-05-12 18:05:24', 1000000001, '2011-11-18 05:17:58', 'active', 1000000001, 'System Defaults', 50, 'User Role', 'guest'),
(1000000022, 1000000001, '2011-05-12 18:07:45', 1000000001, '2011-11-18 05:18:26', 'active', 1000000001, 'System Defaults', 50, 'Company Country', 'US'),
(1000000027, 1000000001, '2011-05-12 18:41:49', NULL, NULL, 'active', 1000000001, 'Root', 0, 'User Roles', ''),
(1000000028, 1000000001, '2011-05-12 18:42:09', 1000000001, '2012-02-09 06:54:50', 'active', 1000000001, 'User Roles', 20, 'guest', 'home.php'),
(1000000029, 1000000001, '2011-05-12 18:42:19', 1000000001, '2012-02-05 09:36:23', 'active', 1000000001, 'User Roles', 30, 'member', 'myinfo2.php'),
(1000000030, 1000000001, '2011-05-12 18:42:33', 1000000001, '2012-02-09 06:54:59', 'active', 1000000001, 'User Roles', 40, 'teacher', 'home.php'),
(1000000031, 1000000001, '2011-05-12 18:42:46', 1000000001, '2012-04-03 07:56:31', 'active', 1000000001, 'User Roles', 60, 'leader', 'groups.php'),
(1000000032, 1000000001, '2011-05-12 18:43:01', 1000000001, '2012-02-08 09:57:45', 'active', 1000000001, 'User Roles', 70, 'account', 'payments.php'),
(1000000033, 1000000001, '2011-05-12 18:43:10', 1000000001, '2012-08-19 07:01:39', 'active', 1000000001, 'User Roles', 80, 'admin', 'summary.php'),
(1000000034, 1000000001, '2011-05-12 18:43:20', 1000000001, '2011-11-17 06:17:45', 'active', 1000000001, 'User Roles', 90, 'support', 'controls'),
(1000000037, 1000000001, '2011-05-15 06:22:43', NULL, NULL, 'active', 1000000001, 'Root', 0, 'User Resources', ''),
(1000000038, 1000000001, '2011-05-15 06:24:21', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Comments', ''),
(1000000039, 1000000001, '2011-05-15 06:24:28', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Controls', ''),
(1000000040, 1000000001, '2011-05-15 06:24:45', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Companies', ''),
(1000000056, 1000000001, '2011-05-15 07:19:47', NULL, NULL, 'active', 1000000001, 'User Actions', 200, 'Login', ''),
(1000000042, 1000000001, '2011-05-15 06:25:10', 1000000001, '2011-05-18 16:44:58', 'active', 1000000001, 'User Resources', 50, 'Tickets', ''),
(1000000043, 1000000001, '2011-05-15 06:25:16', 1000000001, '2011-05-18 16:45:28', 'active', 1000000001, 'User Resources', 50, 'Permissions', ''),
(1000000044, 1000000001, '2011-05-15 06:30:40', 1000000001, '2011-05-15 06:37:37', 'active', 1000000001, 'Root', 0, 'User Actions', ''),
(1000000045, 1000000001, '2011-05-15 06:33:00', 1000000001, '2011-05-15 12:51:11', 'active', 1000000001, 'User Actions', 20, 'Denied', ''),
(1000000046, 1000000001, '2011-05-15 06:33:07', 1000000001, '2011-05-15 07:13:57', 'active', 1000000001, 'User Actions', 10, 'All', ''),
(1000000047, 1000000001, '2011-05-15 06:33:23', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'View', ''),
(1000000048, 1000000001, '2011-05-15 06:33:38', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Insert', ''),
(1000000049, 1000000001, '2011-05-15 06:33:45', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Update', ''),
(1000000050, 1000000001, '2011-05-15 06:33:52', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Delete', ''),
(1000000051, 1000000001, '2011-05-15 06:34:03', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Publish', ''),
(1000000062, 1000000001, '2011-05-18 16:46:14', 1000000001, '2011-09-10 06:32:19', 'active', 1000000001, 'Status Codes', 50, 'history', ''),
(1000000054, 1000000001, '2011-05-15 07:17:23', 1000000001, '2012-02-08 09:57:31', 'active', 1000000001, 'User Roles', 50, 'captain', 'groups.php'),
(1000000055, 1000000001, '2011-05-15 07:18:25', 1000000001, '2011-05-18 16:45:34', 'active', 1000000001, 'User Resources', 50, 'Users', ''),
(1000000057, 1000000001, '2011-05-15 07:19:58', NULL, NULL, 'active', 1000000001, 'User Actions', 210, 'Logout', ''),
(1000000058, 1000000001, '2011-05-15 07:20:08', 1000000001, '2011-05-15 07:20:17', 'active', 1000000001, 'User Actions', 220, 'Update Profile', ''),
(1000000059, 1000000001, '2011-05-15 09:38:14', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Export', ''),
(1000000060, 1000000001, '2011-05-16 19:41:20', NULL, NULL, 'active', 1000000001, 'User Resources', 10, 'Home', ''),
(1000000061, 1000000001, '2011-05-16 19:41:56', 1000000001, '2012-02-09 06:54:42', 'active', 1000000001, 'User Roles', 10, 'visitor', 'home.php'),
(1000000064, 1000000001, '2011-05-25 16:53:58', NULL, NULL, 'active', 1000000001, 'Root', 0, 'Company Types', ''),
(1000000065, 1000000001, '2011-05-25 16:54:19', NULL, NULL, 'active', 1000000001, 'Company Types', 50, 'Domain', ''),
(1000000066, 1000000001, '2011-05-25 16:54:26', NULL, NULL, 'active', 1000000001, 'Company Types', 50, 'Company', ''),
(1000000067, 1000000001, '2011-05-25 16:54:44', NULL, NULL, 'active', 1000000001, 'Company Types', 50, 'Individual', ''),
(1000000073, 1000000001, '2011-05-29 09:56:52', NULL, NULL, 'active', 1000000001, 'User Resources', 20, 'Admin', ''),
(1000000076, NULL, NULL, NULL, NULL, 'active', 1000000001, 'Root', 0, 'Template Types', ''),
(1000000077, NULL, NULL, NULL, NULL, 'active', 1000000001, 'Template Types', 0, 'by time', ''),
(1000000078, NULL, NULL, NULL, NULL, 'active', 1000000001, 'Template Types', 0, 'by event', ''),
(1000000079, NULL, NULL, NULL, NULL, 'active', 1000000001, 'Template Types', 0, 'mass email', ''),
(1000000080, 1000000001, '2011-06-09 17:42:29', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Categories', ''),
(1000000081, 1000000001, '2011-06-09 17:42:42', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Templates', ''),
(1000000082, 1000000001, '2011-06-26 21:29:49', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Models', ''),
(1000000083, 1000000001, '2011-06-26 21:31:02', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Products', ''),
(1000000107, 1000000001, '2011-09-13 17:52:11', 1000000001, '2011-09-27 06:44:32', 'active', 1000000001, 'User Resources', 50, 'Services', ''),
(1000000197, 1000000001, '2011-09-17 07:39:10', NULL, NULL, 'active', 1000000001, 'Group Types', 0, 'tw', ''),
(1000000195, 1000000001, '2011-09-17 07:38:33', NULL, NULL, 'active', 1000000001, 'Root', 0, 'Group Types', ''),
(1000000196, 1000000001, '2011-09-17 07:39:02', NULL, NULL, 'active', 1000000001, 'Group Types', 0, 'us', ''),
(1000000200, 1000000001, '2011-11-18 06:03:48', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'My Info', ''),
(1000000201, 1000000001, '2012-04-25 08:28:07', 1000000001, '2012-07-20 16:47:41', 'active', 1000000001, 'Root', 0, 'Display Rows', ''),
(1000000202, 1000000001, '2012-04-25 08:28:23', NULL, NULL, 'active', 1000000001, 'Display Rows', 10, '10', ''),
(1000000203, 1000000001, '2012-04-25 08:28:33', NULL, NULL, 'active', 1000000001, 'Display Rows', 20, '20', ''),
(1000000204, 1000000001, '2012-04-25 08:29:25', NULL, NULL, 'active', 1000000001, 'Display Rows', 30, '50', ''),
(1000000205, 1000000001, '2012-04-25 08:30:16', NULL, NULL, 'active', 1000000001, 'Display Rows', 40, '100', ''),
(1000000206, 1000000001, '2012-04-25 08:30:32', NULL, NULL, 'active', 1000000001, 'Display Rows', 50, '200', ''),
(1000000207, 1000000001, '2012-04-25 08:30:44', NULL, NULL, 'active', 1000000001, 'Display Rows', 60, '500', ''),
(1000000208, 1000000001, '2012-04-25 08:30:54', NULL, NULL, 'active', 1000000001, 'Display Rows', 70, '1000', ''),
(1000000226, 1000000001, '2012-05-06 11:56:30', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Settings', ''),
(1000000227, 1000000001, '2012-06-02 06:14:46', NULL, NULL, 'active', 1000000001, 'User Actions', 50, 'Combine', ''),
(1000000230, 1000000001, '2012-07-10 07:23:19', 1000000001, '2012-07-10 07:23:27', 'active', 1000000001, 'User Resources', 50, 'Translations', ''),
(1000000231, 1000000001, '2012-08-06 08:13:29', NULL, NULL, 'active', 1000000001, 'Root', 0, 'Priorities', ''),
(1000000232, 1000000001, '2012-08-06 08:13:46', NULL, NULL, 'active', 1000000001, 'Priorities', 10, 'minor', ''),
(1000000233, 1000000001, '2012-08-06 08:17:25', NULL, NULL, 'active', 1000000001, 'Priorities', 50, 'normal', ''),
(1000000234, 1000000001, '2012-08-06 08:17:34', NULL, NULL, 'active', 1000000001, 'Priorities', 90, 'major', ''),
(1000000235, 1000000001, '2012-08-06 08:17:45', NULL, NULL, 'active', 1000000001, 'Priorities', 99, 'critical', ''),
(1000000236, 1000000001, '2012-08-15 13:45:03', NULL, NULL, 'active', 1000000001, 'Root', 0, 'Summary', ''),
(1000000237, 1000000001, '2012-08-15 13:45:21', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Count by Age', ''),
(1000000238, 1000000001, '2012-08-15 13:45:31', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Count by Church', ''),
(1000000239, 1000000001, '2012-08-15 13:45:49', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Count by Gift', ''),
(1000000240, 1000000001, '2012-08-15 13:49:14', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Language English', ''),
(1000000241, 1000000001, '2012-08-15 13:49:24', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Language Mandarim', ''),
(1000000242, 1000000001, '2012-08-15 13:49:35', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Language Taiwanese', ''),
(1000000243, 1000000001, '2012-08-15 13:49:44', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Percentage Completed', ''),
(1000000247, 1000000001, '2012-08-17 19:36:19', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Count by School Year', ''),
(1000000245, 1000000001, '2012-08-15 13:50:03', NULL, NULL, 'active', 1000000001, 'Summary', 0, 'Tshirt Size', ''),
(1000000246, 1000000001, '2012-08-15 13:51:00', NULL, NULL, 'active', 1000000001, 'User Resources', 50, 'Summary', '');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE IF NOT EXISTS `emails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `letter_id` bigint(20) unsigned DEFAULT NULL,
  `sent_from` bigint(20) unsigned DEFAULT NULL,
  `sent_to` bigint(20) unsigned DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `confirm` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `to_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `to_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cc_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cc_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `controller` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `sent_to` (`sent_to`),
  KEY `confirm` (`confirm`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `families`
--

CREATE TABLE IF NOT EXISTS `families` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `address_id` bigint(20) unsigned DEFAULT NULL,
  `family_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `address_id` (`address_id`),
  KEY `family_name` (`family_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `organ_id` bigint(20) unsigned DEFAULT NULL,
  `leader_id` bigint(20) unsigned DEFAULT NULL,
  `trainner_id` bigint(20) unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `group_type` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `group_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `group_tags` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extra_info` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `organ` (`organ_id`),
  KEY `leader` (`leader_id`),
  KEY `trainner` (`trainner_id`),
  KEY `name` (`group_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE IF NOT EXISTS `history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `parent_name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `command` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `history` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `parent` (`parent_name`,`parent_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `jky_users`
--

CREATE TABLE IF NOT EXISTS `jky_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `person_id` bigint(20) unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_type` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'user',
  `user_role` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'guest',
  `user_key` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `person` (`person_id`),
  KEY `user_name` (`user_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000003 ;

--
-- Dumping data for table `jky_users`
--

INSERT INTO `jky_users` (`id`, `created_by`, `created_at`, `updated_by`, `updated_at`, `status`, `person_id`, `start_date`, `end_date`, `user_name`, `user_type`, `user_role`, `user_key`, `password`) VALUES
(1000000001, NULL, NULL, NULL, NULL, 'active', 1000000001, '2012-09-24', NULL, 'patjan', 'support', 'support', '6e5fa4d9c48ca921c0a2ce1e64c9ae6f', '6e5fa4d9c48ca921c0a2ce1e64c9ae6f');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE IF NOT EXISTS `members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `organ_id` bigint(20) unsigned DEFAULT NULL,
  `person_id` bigint(20) unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `member_type` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `member_tags` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extra_info` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `organ_id` (`organ_id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `support_id` bigint(20) unsigned DEFAULT NULL,
  `contact_id` bigint(20) unsigned DEFAULT NULL,
  `address_id` bigint(20) unsigned DEFAULT NULL,
  `organ_number` bigint(20) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `organ_type` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'church',
  `organ_abbr` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `organ_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `web_site` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fax_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `time_zone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `organ_tags` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extra_info` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `address_id` (`address_id`),
  KEY `organ_number` (`organ_number`),
  KEY `organ_abbr` (`organ_abbr`),
  KEY `organ_name` (`organ_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `user_role` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_resource` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_action` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_role` (`user_role`),
  KEY `user_resource` (`user_resource`),
  KEY `user_action` (`user_action`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000002 ;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `created_by`, `created_at`, `updated_by`, `updated_at`, `status`, `user_role`, `user_resource`, `user_action`) VALUES
(1000000001, NULL, NULL, NULL, NULL, 'active', 'support', 'All', 'All');

-- --------------------------------------------------------

--
-- Table structure for table `persons`
--

CREATE TABLE IF NOT EXISTS `persons` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `family_id` bigint(20) unsigned DEFAULT NULL,
  `address_id` bigint(20) unsigned DEFAULT NULL,
  `person_number` bigint(20) DEFAULT '0',
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `official_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `special_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `person_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `gender` char(6) COLLATE utf8_unicode_ci DEFAULT 'male',
  `birth_date` date DEFAULT NULL,
  `mobile_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `work_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `language` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'en_us',
  `avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `person_tags` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extra_info` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `family_id` (`family_id`),
  KEY `address_id` (`address_id`),
  KEY `person_number` (`person_number`),
  KEY `first_name` (`first_name`),
  KEY `last_name` (`last_name`),
  KEY `person_email` (`person_email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000002 ;

--
-- Dumping data for table `persons`
--

INSERT INTO `persons` (`id`, `created_by`, `created_at`, `updated_by`, `updated_at`, `status`, `family_id`, `address_id`, `person_number`, `first_name`, `last_name`, `full_name`, `official_name`, `special_name`, `person_email`, `gender`, `birth_date`, `mobile_number`, `work_number`, `language`, `avatar`, `person_tags`, `extra_info`) VALUES
(1000000001, NULL, NULL, NULL, NULL, 'active', NULL, NULL, 1000000001, 'Pat', 'Jan', 'Pat Jan', 'Kuen Yau Jan', '', 'pat_jan@hotmail.com', 'male', '1956-03-24', '714-801-5752', '', 'en_us', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `relations`
--

CREATE TABLE IF NOT EXISTS `relations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `person_id` bigint(20) unsigned DEFAULT NULL,
  `relation_id` bigint(20) unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `relationship` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `relation_id` (`relation_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE IF NOT EXISTS `templates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `organ_id` bigint(20) unsigned DEFAULT NULL,
  `template_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `template_type` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `template_subject` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `template_body` text COLLATE utf8_unicode_ci,
  `template_sql` text COLLATE utf8_unicode_ci,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `organ_id` (`organ_id`),
  KEY `template_name` (`template_name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE IF NOT EXISTS `tickets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `organ_id` bigint(20) unsigned DEFAULT NULL,
  `opened_by` bigint(20) unsigned DEFAULT NULL,
  `opened_at` datetime DEFAULT NULL,
  `assigned_to` bigint(20) unsigned DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `closed_by` bigint(20) unsigned DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `priority` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'normal',
  `description` text COLLATE utf8_unicode_ci,
  `resolution` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `organ_id` (`organ_id`),
  KEY `opened_at` (`priority`,`opened_at`),
  KEY `assigned_at` (`assigned_to`,`priority`,`assigned_at`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001 ;

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE IF NOT EXISTS `translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` varchar(32) COLLATE utf8_unicode_ci DEFAULT 'active',
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `locale` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sentence` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `locale` (`locale`),
  KEY `sentence` (`sentence`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
