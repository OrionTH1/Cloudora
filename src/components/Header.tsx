import Search from "./Search";
import FileUploader from "./FileUploader";

interface HeaderProps {
  accountId: string;
  userId: string;
  maxStorageSize: number;
}

function Header({ accountId, userId, maxStorageSize }: HeaderProps) {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader
          accountId={accountId}
          ownerId={userId}
          maxStorageSize={maxStorageSize}
        />
      </div>
    </header>
  );
}

export default Header;
