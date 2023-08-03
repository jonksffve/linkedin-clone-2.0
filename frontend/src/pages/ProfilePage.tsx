import { useParams } from "react-router-dom";
import { useEffect } from "react";
import CardContainer from "@/components/CardContainer";

const ProfilePage = () => {
  const { userEmail } = useParams();

  return (
    <div>
      <CardContainer>
        <div>
          <div>img</div>
          <div>img</div>
        </div>
      </CardContainer>
      <CardContainer>Body Posts</CardContainer>
    </div>
  );
};

export default ProfilePage;
