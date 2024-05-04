SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `nameOfUser` varchar(500) DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `phoneNumber` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `birthday` varchar(500) DEFAULT NULL,
  `debt` float NOT NULL DEFAULT '0',
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `debts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `sessionId` int(11) DEFAULT NULL,
  `accountId` int(11) DEFAULT NULL,
  `userName` varchar(400) NOT NULL,
  `clientName` varchar(400) NOT NULL,
  `accountName` varchar(400) DEFAULT NULL,
  `enter` float NOT NULL,
  `outlet` float NOT NULL,
  `note` varchar(400) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dTransactions` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `categoryName` varchar(500) NOT NULL,
  `productName` varchar(500) NOT NULL,
  `userName` varchar(500) NOT NULL,
  `enter` float DEFAULT NULL,
  `outlet` float DEFAULT NULL,
  `after` float NOT NULL,
  `description` varchar(1500) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `linkedProduct` (
  `id` int(11) NOT NULL,
  `productLinkId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mAccount` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `mAccount` (`id`, `name`, `amount`) VALUES
(1, 'Cash', 45),
(2, 'Carte Bancaire', 136),
(3, 'M-Pesa', 15),
(4, 'Illico Cash', 60),
(5, 'Airtel Money', 0);

CREATE TABLE `mCategory` (
  `id` int(11) NOT NULL,
  `pCategoryId` int(11) DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `type` varchar(500) NOT NULL,
  `defaultForBuy` tinyint(1) NOT NULL DEFAULT '0',
  `defaultForSell` tinyint(1) NOT NULL DEFAULT '0',
  `isSystem` tinyint(1) NOT NULL DEFAULT '0',
  `cannotDelete` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `mCategory` (`id`, `pCategoryId`, `name`, `type`, `defaultForBuy`, `defaultForSell`, `isSystem`, `cannotDelete`) VALUES
(1, NULL, 'Vente', 'enter', 0, 1, 0, 1),
(2, NULL, 'Achat Produit', 'outlet', 1, 0, 0, 1),
(3, NULL, 'Paiement Dette', 'enter', 0, 0, 0, 1),
(4, 1, 'Achat Boissons', 'outlet', 0, 0, 0, 0),
(5, 2, 'Achat Spiritueux', 'outlet', 0, 0, 0, 0),
(6, 3, 'Achat Plats', 'outlet', 0, 0, 0, 0),
(7, 4, 'Achat Cigarettes', 'outlet', 0, 0, 0, 0),
(8, NULL, 'Changement CE', 'enter', 0, 0, 0, 0);

CREATE TABLE `mTransactions` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `transactionId` int(11) DEFAULT NULL,
  `accountId` int(11) NOT NULL,
  `categoryName` varchar(500) NOT NULL,
  `userName` varchar(500) NOT NULL,
  `accountName` varchar(200) NOT NULL,
  `enter` float DEFAULT NULL,
  `outlet` float DEFAULT NULL,
  `after` float DEFAULT NULL,
  `description` varchar(1500) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `unit` varchar(500) NOT NULL,
  `isSellable` tinyint(1) NOT NULL,
  `isVersatile` tinyint(1) NOT NULL,
  `price` float DEFAULT NULL,
  `buyPrice` float DEFAULT NULL,
  `inStock` float DEFAULT NULL,
  `depotStock` float NOT NULL DEFAULT '0',
  `hasLink` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `productsCategory` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ptCategory` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `type` varchar(500) NOT NULL,
  `defaultForSell` tinyint(1) NOT NULL DEFAULT '0',
  `defaultForBuy` tinyint(1) NOT NULL DEFAULT '0',
  `isSystem` tinyint(1) NOT NULL DEFAULT '0',
  `cannotDelete` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ptCategory` (`id`, `name`, `type`, `defaultForSell`, `defaultForBuy`, `isSystem`, `cannotDelete`) VALUES
(1, 'Vente', 'outlet', 1, 0, 0, 1),
(2, 'Entrées GastroSys', 'enter', 0, 0, 1, 1),
(3, 'Sorties GastroSys', 'outlet', 0, 0, 1, 1),
(4, 'Approvisionnement', 'enter', 0, 0, 0, 1),
(5, 'Transfert Stock', 'outlet', 0, 0, 0, 1),
(6, 'Réception Stock', 'enter', 0, 0, 0, 1),
(7, 'Equilibrage Stock (Entrée)', 'enter', 0, 0, 0, 1),
(8, 'Equilibrage Stock (Sortie)', 'outlet', 0, 0, 0, 1);

CREATE TABLE `sessionItems` (
  `id` int(11) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `userName` varchar(500) NOT NULL,
  `productName` varchar(500) NOT NULL,
  `price` float NOT NULL,
  `quantity` float NOT NULL,
  `taken` float NOT NULL DEFAULT '0',
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `clientId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `accountId` int(11) DEFAULT NULL,
  `clientName` varchar(500) NOT NULL,
  `userName` varchar(500) NOT NULL,
  `accountName` varchar(500) DEFAULT NULL,
  `serverName` varchar(500) NOT NULL,
  `total` float NOT NULL,
  `reduction` float NOT NULL,
  `isDone` tinyint(1) NOT NULL DEFAULT '0',
  `isPaid` tinyint(1) NOT NULL DEFAULT '0',
  `isDebt` tinyint(1) NOT NULL DEFAULT '0',
  `invoice` varchar(500) DEFAULT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `sessionId` int(11) DEFAULT NULL,
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `categoryName` varchar(500) NOT NULL,
  `productName` varchar(500) NOT NULL,
  `userName` varchar(500) NOT NULL,
  `enter` float DEFAULT NULL,
  `outlet` float DEFAULT NULL,
  `after` float NOT NULL,
  `description` varchar(1500) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `username` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `type` varchar(500) NOT NULL,
  `timestamp` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `sessionId` int(11) DEFAULT NULL,
  `serverName` varchar(150) NOT NULL,
  `clientName` varchar(400) DEFAULT NULL,
  `voucherUrl` varchar(200) NOT NULL,
  `printed` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `debts`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `dTransactions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `linkedProduct`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mAccount`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mCategory`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `mTransactions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `productsCategory`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ptCategory`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sessionItems`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `debts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `dTransactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `linkedProduct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `mAccount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `mCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `mTransactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `productsCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ptCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `sessionItems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
