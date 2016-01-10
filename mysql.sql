-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.1.10-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- osuserve_osuserver 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `osuserve_osuserver` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `osuserve_osuserver`;


-- 테이블 osuserve_osuserver.scores 구조 내보내기
CREATE TABLE IF NOT EXISTS `scores` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `beatmapHash` varchar(32) DEFAULT NULL,
  `playerID` varchar(5) DEFAULT NULL,
  `count300` int(11) DEFAULT NULL,
  `count100` int(11) DEFAULT NULL,
  `count50` int(11) DEFAULT NULL,
  `countKatu` int(11) DEFAULT NULL,
  `countGeki` int(11) DEFAULT NULL,
  `countMiss` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `combo` int(11) DEFAULT NULL,
  `fc` tinyint(1) DEFAULT NULL,
  `mods` int(11) DEFAULT NULL,
  `time` varchar(18) DEFAULT NULL,
  `mode` tinyint(4) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 osuserve_osuserver.users_accounts 구조 내보내기
CREATE TABLE IF NOT EXISTS `users_accounts` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `osuname` varchar(16) DEFAULT NULL,
  `passwordHash` varchar(32) DEFAULT NULL,
  `salt` varchar(5) DEFAULT NULL,
  `playerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `열 1` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 osuserve_osuserver.users_data 구조 내보내기
CREATE TABLE IF NOT EXISTS `users_data` (
  `playerID` int(11) NOT NULL AUTO_INCREMENT,
  `passwordHash` varchar(32) DEFAULT NULL,
  `salt` varchar(5) DEFAULT NULL,
  `avatarID` varchar(11) DEFAULT NULL,
  `clan` int(11) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT NULL,
  `displayName` varchar(24) DEFAULT NULL,
  PRIMARY KEY (`playerID`),
  UNIQUE KEY `playerID` (`playerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 내보낼 데이터가 선택되어 있지 않습니다.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
