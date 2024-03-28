{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs
  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    previews = [
      {
        id = "web";
        manager = "web";
        command = [
          "npm"
          "run"
          "dev"
        ];
      }
    ];
  };
}