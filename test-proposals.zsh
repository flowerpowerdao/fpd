for i in {0..30}
do
dfx canister call --async dao submitTestProposal '(record {title = "[Collection] Proposal '$i'"; description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus fringilla hendrerit. Integer efficitur facilisis nulla, vitae consequat sapien faucibus vitae. Maecenas egestas risus eu nisl gravida luctus. Curabitur consequat, tellus nec condimentum interdum, sapien augue aliquam urna, aliquet varius nibh leo id diam. Nullam ornare elementum ligula, a lacinia nibh vehicula a. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed euismod sodales eros, nec mattis arcu malesuada eget. Sed blandit tristique odio, ac gravida sapien rutrum nec. Proin laoreet massa id gravida facilisis. Aenean eu metus urna.

Aenean pulvinar sapien non augue laoreet rhoncus. In metus purus, hendrerit eu finibus eget, vestibulum at neque. Sed quis lorem varius, laoreet mauris eu, volutpat massa. Phasellus tempus odio a odio rhoncus, eget accumsan ligula porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et porta purus, vel imperdiet est. Duis nec gravida ipsum. Ut a dui sit amet justo viverra ultricies ut a ipsum. Duis in odio non tortor venenatis placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nisl erat, vestibulum a vehicula sed, bibendum nec est. Curabitur nec ex dui. Maecenas tincidunt hendrerit consequat.

Morbi sed porta lorem. Curabitur pellentesque nisi a quam vulputate, non congue urna porta. Aenean id mi id massa aliquam malesuada et eget ipsum. Nunc vulputate placerat egestas. Nam purus metus, cursus vitae imperdiet non, finibus viverra velit. Nullam elit magna, rhoncus ac cursus eu, aliquet et justo. Vestibulum a rhoncus ipsum, sed pretium leo.

Sed sagittis feugiat justo, sit amet volutpat nibh pellentesque at. In eu nulla quis diam mattis sollicitudin. Quisque in sapien elit. Nam id erat elit. Sed iaculis, sem consectetur iaculis dapibus, ligula massa pulvinar felis, at eleifend lectus nunc vel enim. Maecenas rhoncus faucibus semper. Mauris magna lorem, convallis auctor neque ac, egestas viverra nulla. Duis viverra viverra lacus, a ultricies mauris egestas molestie. Maecenas a mattis odio, sed accumsan justo. Maecenas sollicitudin nec augue eu hendrerit. Nulla at rhoncus ligula, eu euismod urna. Integer euismod sodales interdum. Quisque enim libero, pharetra non ultrices sit amet, viverra eget purus. Vestibulum aliquet sollicitudin malesuada. Pellentesque hendrerit nisl lorem. Phasellus ultrices leo sit amet velit molestie fringilla.

Curabitur at bibendum magna, id imperdiet tellus. Etiam sed neque lectus. Suspendisse venenatis nibh eu leo blandit, eu facilisis ipsum dapibus. Donec blandit leo magna, sit amet aliquet diam ornare non. Ut sem mauris, posuere quis augue id, vestibulum tempus urna. Maecenas condimentum tellus vel arcu fringilla vulputate. Etiam vitae est sem."; options = vec { "option 1"; "option 2"; "option 3"}})'
done

for i in {31..60}
do
dfx canister call --async dao submitTestProposal '(record { title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus fringilla hendrerit. Integer efficitur facilisis nulla, vitae consequat sapien faucibus vitae. Maecenas egestas risus eu nisl gravida luctus. Curabitur consequat, tellus nec condimentum interdum, sapien augue aliquam urna, aliquet varius nibh leo id diam. Nullam ornare elementum ligula, a lacinia nibh vehicula a. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed euismod sodales eros, nec mattis arcu malesuada eget. Sed blandit tristique odio, ac gravida sapien rutrum nec. Proin laoreet massa id gravida facilisis. Aenean eu metus urna.

Aenean pulvinar sapien non augue laoreet rhoncus. In metus purus, hendrerit eu finibus eget, vestibulum at neque. Sed quis lorem varius, laoreet mauris eu, volutpat massa. Phasellus tempus odio a odio rhoncus, eget accumsan ligula porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et porta purus, vel imperdiet est. Duis nec gravida ipsum. Ut a dui sit amet justo viverra ultricies ut a ipsum. Duis in odio non tortor venenatis placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nisl erat, vestibulum a vehicula sed, bibendum nec est. Curabitur nec ex dui. Maecenas tincidunt hendrerit consequat.

Morbi sed porta lorem. Curabitur pellentesque nisi a quam vulputate, non congue urna porta. Aenean id mi id massa aliquam malesuada et eget ipsum. Nunc vulputate placerat egestas. Nam purus metus, cursus vitae imperdiet non, finibus viverra velit. Nullam elit magna, rhoncus ac cursus eu, aliquet et justo. Vestibulum a rhoncus ipsum, sed pretium leo.

Sed sagittis feugiat justo, sit amet volutpat nibh pellentesque at. In eu nulla quis diam mattis sollicitudin. Quisque in sapien elit. Nam id erat elit. Sed iaculis, sem consectetur iaculis dapibus, ligula massa pulvinar felis, at eleifend lectus nunc vel enim. Maecenas rhoncus faucibus semper. Mauris magna lorem, convallis auctor neque ac, egestas viverra nulla. Duis viverra viverra lacus, a ultricies mauris egestas molestie. Maecenas a mattis odio, sed accumsan justo. Maecenas sollicitudin nec augue eu hendrerit. Nulla at rhoncus ligula, eu euismod urna. Integer euismod sodales interdum. Quisque enim libero, pharetra non ultrices sit amet, viverra eget purus. Vestibulum aliquet sollicitudin malesuada. Pellentesque hendrerit nisl lorem. Phasellus ultrices leo sit amet velit molestie fringilla.

Curabitur at bibendum magna, id imperdiet tellus. Etiam sed neque lectus. Suspendisse venenatis nibh eu leo blandit, eu facilisis ipsum dapibus. Donec blandit leo magna, sit amet aliquet diam ornare non. Ut sem mauris, posuere quis augue id, vestibulum tempus urna. Maecenas condimentum tellus vel arcu fringilla vulputate. Etiam vitae est sem."; options = vec { "option 1"; "option 2"; "option 3"}})'
done