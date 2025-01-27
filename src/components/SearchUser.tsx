"use client";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { searchUser } from "@/app/actions/user.action";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import FollowButton from "./FollowButton";
import { CircleX, ShieldCloseIcon } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  username: string;
  image?: string;
  _count: {
    followers: number;
  };
}[];

function SearchUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = debounce(async (term: string) => {
    setIsLoading(true);
    if (term.length > 0) {
      const results = await searchUser(term);
      setSearchResults(results as SearchResult);
      setIsLoading(false);
    } else {
      setSearchResults([]);
    }
  }, 100);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 relative">
        <Input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full p-2 rounded-md"
        />
        {searchTerm.length > 0 && (
          // <Button onClick={handleClearSearch}>Close</Button>
          <CircleX
            className="absolute right-2 w-4 h-4 cursor-pointer text-gray-300"
            onClick={handleClearSearch}
          />
        )}
      </div>
      {isLoading ? (
        <Card className="absolute z-50 w-full border border-gray-300">
          <CardHeader>
            <div>Loading...</div>
          </CardHeader>
        </Card>
      ) : searchResults.length > 0 ? (
        <Card className="absolute z-50 w-full border border-gray-300">
          <CardContent className="pt-6">
            <div className="space-y-4 z-50">
              {searchResults?.map((user) => (
                <div
                  key={user.id}
                  className="flex gap-2 items-center justify-between "
                >
                  <div className="flex items-center gap-1">
                    <Link href={`/profile/${user.username}`}>
                      <Avatar>
                        <AvatarImage src={user.image ?? "/avatar.png"} />
                      </Avatar>
                    </Link>
                    <div className="text-xs">
                      <Link
                        href={`/profile/${user.username}`}
                        className="font-medium cursor-pointer"
                      >
                        {user.name}
                      </Link>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <p className="text-muted-foreground">
                        {user._count.followers} followers
                      </p>
                    </div>
                  </div>
                  <FollowButton userId={user.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : searchTerm.length > 0 ? (
        <Card className="absolute z-50 w-full border border-gray-300">
          <CardHeader>
            <div>No results found</div>
          </CardHeader>
        </Card>
      ) : null}

      {/* {searchResults.length > 0 && (
        <div className="absolute bg-white border border-gray-300 rounded-md shadow-md w-full z-50">
          {searchResults.map((user) => (
            <div key={user.id} className="p-2 hover:bg-gray-100 cursor-pointer">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <Link href={`/profile/${user.username}`}>
                    <Avatar>
                      <AvatarImage src={user.image ?? "/avatar.png"} />
                    </Avatar>
                  </Link>
                  <div className="text-xs">
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium cursor-pointer"
                    >
                      {user.name}
                    </Link>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <p className="text-muted-foreground">
                      {user._count.followers} followers
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default SearchUser;
