SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `angulartest`
--

CREATE DATABASE IF NOT EXISTS `angulartest` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `angulartest`;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` text NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`name`, `description`, `price`) VALUES
('HP/Compaq Z2200', 'New laptop from HP', 3000),
('Samsung Galaxy S6', 'The latest and greatest Galaxy Phone from Samsung!!', 499),
('Palm Pre2', 'Palm just released their new phone with webOS!', 199),
('IBM AS400', 'Batch processing at its finest!', 19999),
('Dell Lattitude 440', 'The suckiest Dell product every produced!', 899);
